import json
import time
import logging
import threading
from datetime import datetime

from modules.crawler import Crawler
from modules.scanner import Scanner
from modules.ai_engine import AIEngine

logger = logging.getLogger(__name__)


class ScanManager:


    def __init__(self, socketio, app):
        self.socketio     = socketio
        self.app          = app          
        self.active_scans = {}

    def start_scan(self, scan_id: str, target_url: str, user_id, room: str):
        t = threading.Thread(
            target=self._run_scan,
            args=(scan_id, target_url, user_id, room),
            daemon=True,
        )
        t.start()
        return scan_id

    def _run_scan(self, scan_id, target_url, user_id, room):
        from models import db, Scan

        with self.app.app_context():
            try:
                self._set_status(scan_id, "initialising", 0, target_url, user_id)
                self._log(room, "Initialising scan modules…", "info")
                self._progress(room, 5)

                self._log(room, f"Crawling {target_url}…", "info")
                self._set_status(scan_id, "crawling", 10, target_url, user_id)

                crawler = Crawler(target_url, max_pages=50)
                crawler.on_page_discovered = lambda p: self._log(
                    room, f"Discovered: {p['url']}", "success"
                )
                pages = crawler.run()

                self._log(room, f"Crawl finished — {len(pages)} page(s) found.", "success")
                self._progress(room, 30)

                self._log(room, "Running vulnerability checks…", "info")
                self._set_status(scan_id, "scanning", 35, target_url, user_id)

                scanner = Scanner(pages)
                scanner.on_vulnerability_found = lambda v: self._log(
                    room,
                    f"{v.get('severity', 'Unknown')} — {v.get('type')}: {v.get('url')}",
                    "warning",
                )
                raw_vulns = scanner.run(target_url)

                self._log(room, f"Scanning complete — {len(raw_vulns)} finding(s) before analysis.", "success")
                self._progress(room, 70)

                self._log(room, "Enriching findings with security analysis…", "ai")
                self._set_status(scan_id, "analysing", 75, target_url, user_id)

                engine = AIEngine()
                enriched = []
                for i, v in enumerate(raw_vulns):
                    self._progress(room, 75 + int((i / max(len(raw_vulns), 1)) * 15))
                    self._log(room, f"Analysing: {v.get('type')}…", "ai")
                    enriched.append({**v, "ai_analysis": engine.analyze_finding(v)})
                    time.sleep(0.15)

                risk_score = self._calculate_risk_score(enriched, pages)
                self._log(room, f"Risk score: {risk_score}/100", "info")
                self._progress(room, 95)

                self._log(room, "Saving results to database…", "info")
                record = Scan(
                    url=target_url,
                    risk_score=risk_score,
                    results_json=json.dumps(enriched),
                    user_id=int(user_id),
                )
                db.session.add(record)
                db.session.commit()

                self._progress(room, 100)
                self._log(room, "Scan completed successfully.", "success")

                self.socketio.emit("scan_complete", {
                    "scan_id": scan_id,
                    "results": {
                        "url":             target_url,
                        "risk_score":      risk_score,
                        "vulnerabilities": enriched,
                        "pages_scanned":   len(pages),
                    },
                }, room=room)

                self._set_status(scan_id, "completed", 100, target_url, user_id)

            except Exception as exc:
                logger.exception("Scan %s failed: %s", scan_id, exc)
                self._log(room, f"Scan failed: {exc}", "error")
                self.socketio.emit("scan_error", {"scan_id": scan_id, "error": str(exc)}, room=room)
                self._set_status(scan_id, "failed", 0, target_url, user_id)
                try:
                    db.session.rollback()
                except Exception:
                    pass

            finally:
                self.active_scans.pop(scan_id, None)
                try:
                    db.session.remove()
                except Exception:
                    pass

    def _calculate_risk_score(self, vulns: list, pages: list) -> int:
        if not vulns:
            return 0

        counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Info": 0}
        for v in vulns:
            sev = v.get("severity", "Low")
            if sev in counts:
                counts[sev] += 1

        n = len(vulns)
        base         = min(40, n * 4 if n <= 5 else 20 + (n - 5) * 2)
        sev_score    = min(15, counts["Critical"] * 5) + min(10, counts["High"] * 2) + min(5, counts["Medium"])
        density      = n / max(len(pages), 1)
        density_score = min(15, density * 10 if density <= 0.5 else 5 + (density - 0.5) * 10)
        crit_bonus   = min(15, counts["Critical"] * 5) if counts["Critical"] else 0

        result = min(100, max(0, round(base + sev_score + density_score + crit_bonus)))
        logger.info("Risk breakdown — base:%d sev:%d density:%.1f crit_bonus:%d → %d",
                    base, sev_score, density_score, crit_bonus, result)
        return result

    def _log(self, room: str, message: str, log_type: str = "info"):
        self.socketio.emit("scan_log", {
            "message":   message,
            "type":      log_type,
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        }, room=room)

    def _progress(self, room: str, pct: int):
        self.socketio.emit("scan_progress", {"progress": pct}, room=room)

    def _set_status(self, scan_id, status, progress, url, user_id):
        self.active_scans[scan_id] = {
            "status": status, "progress": progress, "url": url, "user_id": user_id,
        }