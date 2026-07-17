import uuid
import logging
import threading
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class ScanScheduler:


    def __init__(self, app, socketio, scan_manager):
        self.app          = app
        self.socketio     = socketio
        self.scan_manager = scan_manager
        self._stop        = threading.Event()
        self._thread      = None

    def start(self):
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()
        logger.info("ScanScheduler running")

    def stop(self):
        self._stop.set()


    def _loop(self):
        while not self._stop.is_set():
            try:
                self._tick()
            except Exception as exc:
                logger.error("Scheduler error: %s", exc)
            self._stop.wait(60)

    def _tick(self):
        from models import db, ScheduledScan

        with self.app.app_context():
            now = datetime.utcnow()
            due = ScheduledScan.query.filter(
                ScheduledScan.is_active == True,
                ScheduledScan.next_run  <= now,
            ).all()

            for schedule in due:
                scan_id = str(uuid.uuid4())
                room    = f"user_{schedule.user_id}"

                schedule.last_run = now
                schedule.next_run = self._next_run(schedule)
                db.session.commit()

                logger.info(
                    "Firing scheduled scan #%d for %s", schedule.id, schedule.url
                )
                self.scan_manager.start_scan(scan_id, schedule.url, int(schedule.user_id), room)

                self.socketio.emit("scheduled_scan_started", {
                    "schedule_id": schedule.id,
                    "scan_id":     scan_id,
                    "url":         schedule.url,
                    "message":     f"Scheduled scan started for {schedule.url}",
                }, room=room)


    @staticmethod
    def _next_run(schedule) -> datetime:
        now = datetime.utcnow()
        if schedule.schedule_type == "interval":
            return now + timedelta(hours=schedule.interval_hours)
        if schedule.schedule_type == "daily":
            h, m    = map(int, schedule.daily_time.split(":"))
            next_dt = now.replace(hour=h, minute=m, second=0, microsecond=0)
            if next_dt <= now:
                next_dt += timedelta(days=1)
            return next_dt
        return now + timedelta(hours=24)

    @staticmethod
    def compute_first_run(schedule_type: str, interval_hours=None, daily_time=None) -> datetime:
        now = datetime.utcnow()
        if schedule_type == "interval":
            return now + timedelta(hours=int(interval_hours))
        if schedule_type == "daily":
            h, m    = map(int, daily_time.split(":"))
            next_dt = now.replace(hour=h, minute=m, second=0, microsecond=0)
            if next_dt <= now:
                next_dt += timedelta(days=1)
            return next_dt
        return now + timedelta(hours=24)