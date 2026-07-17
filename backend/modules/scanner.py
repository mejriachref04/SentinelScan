import re
import ssl
import json
import time
import socket
import logging
import requests
import urllib3
import urllib.parse
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logger = logging.getLogger(__name__)


class Scanner:
    def __init__(self, pages_data):
        self.pages_data = pages_data
        self.vulnerabilities = []
        self._seen_keys = set()
        self.on_vulnerability_found = None

        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
        })
        self.session.max_redirects = 5

    def _add(self, vuln: dict):
        key = (vuln["type"], vuln["url"].rstrip("/"), vuln["description"][:60])
        if key in self._seen_keys:
            return
        self._seen_keys.add(key)
        self.vulnerabilities.append(vuln)
        if self.on_vulnerability_found:
            self.on_vulnerability_found(vuln)

    def _get(self, url, **kw):
        kw.setdefault("timeout", 8)
        kw.setdefault("verify", False)
        return self.session.get(url, **kw)


    def check_security_headers(self, url):
        checks = {
            "Strict-Transport-Security": (
                "Medium",
                "HSTS header not present — leaves the connection open to SSL-stripping attacks.",
                "Set: Strict-Transport-Security: max-age=31536000; includeSubDomains",
            ),
            "Content-Security-Policy": (
                "Medium",
                "No Content-Security-Policy header — increases XSS and data-injection risk.",
                "Define a restrictive CSP that whitelists only trusted script and style sources.",
            ),
            "X-Frame-Options": (
                "Medium",
                "X-Frame-Options missing — the page can be embedded in a third-party iframe (clickjacking).",
                "Set: X-Frame-Options: DENY  (or SAMEORIGIN if same-origin framing is needed).",
            ),
            "X-Content-Type-Options": (
                "Low",
                "X-Content-Type-Options: nosniff is absent — browser may MIME-sniff responses.",
                "Set: X-Content-Type-Options: nosniff",
            ),
            "Referrer-Policy": (
                "Low",
                "Referrer-Policy not configured — sensitive URL fragments may leak in the Referer header.",
                "Set: Referrer-Policy: strict-origin-when-cross-origin",
            ),
            "Permissions-Policy": (
                "Low",
                "Permissions-Policy header missing — browser features such as camera/microphone are unrestricted.",
                "Set a Permissions-Policy that disables all unneeded browser features.",
            ),
        }

        try:
            resp = self._get(url)
            headers = resp.headers

            for header, (severity, desc, fix) in checks.items():
                if header not in headers:
                    self._add({
                        "type": "Security Misconfiguration",
                        "severity": severity,
                        "url": url,
                        "description": desc,
                        "remediation": fix,
                    })

            server = headers.get("Server", "")
            if server and server.lower() not in ("cloudflare", "nginx", "apache"):
                self._add({
                    "type": "Information Disclosure",
                    "severity": "Low",
                    "url": url,
                    "description": f"Server header exposes technology fingerprint: {server}",
                    "remediation": "Remove or anonymise the Server response header.",
                })
        except Exception as exc:
            logger.debug("check_security_headers failed for %s: %s", url, exc)


    def _xss_reflected_in_executable_context(self, html: str, token: str):
        soup = BeautifulSoup(html, "html.parser")
        tok_lo = token.lower()
        html_lo = html.lower()

        if tok_lo not in html_lo:
            return False, None

        for script in soup.find_all("script"):
            if script.string and tok_lo in script.string.lower():
                return True, "reflected inside <script> block"

        for tag in soup.find_all(True):
            if tok_lo in str(tag).lower():
                for attr in tag.attrs:
                    if attr.startswith("on"):
                        return True, f"reflected as event handler ({attr}) on <{tag.name}>"
                if tag.name in ("script", "iframe", "object", "embed", "link"):
                    return True, f"reflected inside executable <{tag.name}> tag"

        if re.search(
            r'<[^>]+(?:value|href|src|action|data)[^>]*=["\'][^"\']*'
            + re.escape(token)
            + r'[^"\']*["\']',
            html, re.IGNORECASE,
        ):
            return True, "reflected un-encoded inside HTML attribute"

        encoded = [
            token.replace("<", "&lt;").replace(">", "&gt;"),
            token.replace("<", "%3C").replace(">", "%3E"),
            token.replace('"', "&quot;"),
            token.replace("'", "&#x27;"),
        ]
        if any(v.lower() in html_lo for v in encoded):
            return False, None

        if tok_lo in html_lo:
            if not re.search(
                r"<!--.*?" + re.escape(token) + r".*?-->",
                html, re.IGNORECASE | re.DOTALL,
            ):
                return True, "reflected raw and un-encoded in page body"

        return False, None

    def check_xss_vulnerability(self, page):
        import uuid
        url = page["url"]

        def payloads(tok):
            return [
                f"<script>{tok}</script>",
                f'"><script>{tok}</script>',
                f"<img src=x onerror={tok}>",
                f"<svg/onload={tok}>",
                f"'><svg/onload={tok}>",
                f'" onmouseover="{tok}',
            ]

        parsed = urlparse(url)
        params = parse_qs(parsed.query)
        for param, values in params.items():
            tok = f"sx{uuid.uuid4().hex[:8]}"
            original = values[0]
            for pl in payloads(tok):
                try:
                    test_url = url.replace(
                        f"{param}={original}", f"{param}={urllib.parse.quote(pl)}"
                    )
                    resp = self._get(test_url)
                    confirmed, ctx = self._xss_reflected_in_executable_context(resp.text, tok)
                    if confirmed:
                        self._add({
                            "type": "Injection (XSS)",
                            "severity": "High",
                            "url": url,
                            "description": (
                                f"Confirmed reflected XSS in URL parameter '{param}' "
                                f"— token reflected in: {ctx}"
                            ),
                            "remediation": (
                                "HTML-encode all output; add a restrictive Content-Security-Policy; "
                                "validate input server-side."
                            ),
                        })
                        break
                except Exception as exc:
                    logger.debug("XSS param check failed %s: %s", url, exc)
                    continue

        try:
            resp = self._get(url)
            soup = BeautifulSoup(resp.text, "html.parser")
            for form in soup.find_all("form"):
                action = form.get("action", "")
                method = form.get("method", "get").lower()
                form_url = urljoin(url, action) if action else url

                fields = [
                    i.get("name")
                    for i in form.find_all(["input", "textarea", "select"])
                    if i.get("name")
                    and i.get("type", "text") not in
                    ("submit", "button", "image", "hidden", "checkbox", "radio")
                ]
                if not fields:
                    continue

                tok = f"sx{uuid.uuid4().hex[:8]}"
                for pl in payloads(tok):
                    try:
                        data = {f: pl for f in fields}
                        r = (
                            self.session.post(form_url, data=data, timeout=8, verify=False)
                            if method == "post"
                            else self._get(form_url, params=data)
                        )
                        confirmed, ctx = self._xss_reflected_in_executable_context(r.text, tok)
                        if confirmed:
                            self._add({
                                "type": "Injection (XSS)",
                                "severity": "High",
                                "url": url,
                                "description": (
                                    f"Confirmed reflected XSS in form fields "
                                    f"({', '.join(fields)}) — reflected in: {ctx}"
                                ),
                                "remediation": (
                                    "HTML-encode all output; add a restrictive Content-Security-Policy; "
                                    "validate input server-side."
                                ),
                            })
                            break
                    except Exception as exc:
                        logger.debug("XSS form check failed %s: %s", url, exc)
                        continue
        except Exception as exc:
            logger.debug("XSS form fetch failed %s: %s", url, exc)


    def check_sql_injection(self, page):
        url = page["url"]
        parsed = urlparse(url)
        params = parse_qs(parsed.query)
        if not params:
            return

        error_re = re.compile(
            r"(you have an error in your sql syntax"
            r"|warning: mysql"
            r"|unclosed quotation mark after the character string"
            r"|quoted string not properly terminated"
            r"|pg_query\(\): query failed"
            r"|supplied argument is not a valid (mysql|postgresql)"
            r"|microsoft ole db provider for (sql server|odbc)"
            r"|ora-[0-9]{5}:"
            r"|sqlite3\.operationalerror"
            r"|syntax error.*?near"
            r"|division by zero in sql"
            r"|invalid query)",
            re.IGNORECASE,
        )

        for param, values in params.items():
            original = values[0]
            reported = False

            for probe in ("'", "''", "`", '"', "\\", "1'", '1"'):
                try:
                    test = url.replace(f"{param}={original}", f"{param}={probe}")
                    resp = self._get(test)
                    if error_re.search(resp.text):
                        self._add({
                            "type": "Injection (SQL)",
                            "severity": "Critical",
                            "url": url,
                            "description": (
                                f"Confirmed SQL injection (error-based) in parameter '{param}' "
                                f"— database error exposed in the response."
                            ),
                            "remediation": (
                                "Replace all string-concatenated queries with parameterised "
                                "statements or an ORM."
                            ),
                        })
                        reported = True
                        break
                except Exception as exc:
                    logger.debug("SQLi error-based probe failed %s %s: %s", url, param, exc)
                    continue

            if reported:
                continue

            try:
                true_pl  = f"{original} AND 1=1-- -"
                false_pl = f"{original} AND 1=2-- -"

                true_lens, false_lens = [], []
                for _ in range(3):
                    tu = url.replace(f"{param}={original}", f"{param}={true_pl}")
                    fu = url.replace(f"{param}={original}", f"{param}={false_pl}")
                    true_lens.append(len(self._get(tu).text))
                    false_lens.append(len(self._get(fu).text))
                    time.sleep(0.25)

                true_avg  = sum(true_lens)  / 3
                false_avg = sum(false_lens) / 3
                true_stable  = (max(true_lens)  - min(true_lens))  < 30
                false_stable = (max(false_lens) - min(false_lens)) < 30
                significant  = abs(true_avg - false_avg) > 100

                orig_len = len(self._get(url).text)
                true_matches_orig = abs(true_avg - orig_len) < 30

                if true_stable and false_stable and significant and true_matches_orig:
                    self._add({
                        "type": "Injection (SQL)",
                        "severity": "High",
                        "url": url,
                        "description": (
                            f"Confirmed SQL injection (boolean-based) in parameter '{param}' "
                            f"— TRUE/FALSE conditions return consistently different response lengths."
                        ),
                        "remediation": (
                            "Replace all string-concatenated queries with parameterised "
                            "statements or an ORM."
                        ),
                    })
                    reported = True
            except Exception as exc:
                logger.debug("SQLi boolean probe failed %s %s: %s", url, param, exc)

            if reported:
                continue

            try:
                baseline_times = []
                for _ in range(2):
                    t0 = time.time()
                    self._get(url, timeout=15)
                    baseline_times.append(time.time() - t0)
                    time.sleep(0.2)
                baseline = sum(baseline_times) / 2

                time_probes = [
                    (f"{original}' AND SLEEP(5)-- -", 5),
                    (f"{original}' AND pg_sleep(5)-- -", 5),
                    (f"{original}'; WAITFOR DELAY '0:0:5'-- -", 5),
                ]
                for probe, delay in time_probes:
                    try:
                        test = url.replace(f"{param}={original}", f"{param}={probe}")
                        t0 = time.time()
                        self._get(test, timeout=delay + 5)
                        elapsed = time.time() - t0
                        if elapsed >= 4.5 and elapsed >= baseline * 3:
                            self._add({
                                "type": "Injection (SQL)",
                                "severity": "Critical",
                                "url": url,
                                "description": (
                                    f"Confirmed SQL injection (time-based) in parameter '{param}' "
                                    f"— server delayed {elapsed:.1f}s vs baseline {baseline:.1f}s."
                                ),
                                "remediation": (
                                    "Replace all string-concatenated queries with parameterised "
                                    "statements or an ORM."
                                ),
                            })
                            break
                    except Exception as exc:
                        logger.debug("SQLi time probe failed %s %s: %s", url, param, exc)
                        continue
            except Exception as exc:
                logger.debug("SQLi time-based setup failed %s %s: %s", url, param, exc)


    def check_sensitive_files(self, base_url):
        paths = [
            ("/.env",             lambda r: bool(re.search(r"[A-Z_]+=.+", r.text) and "=" in r.text),
             "Critical", ".env file exposed — may contain DB credentials and API keys."),
            ("/.env.local",       lambda r: bool(re.search(r"[A-Z_]+=.+", r.text)),
             "Critical", ".env.local exposed."),
            ("/.env.production",  lambda r: bool(re.search(r"[A-Z_]+=.+", r.text)),
             "Critical", ".env.production exposed."),
            ("/.git/config",      lambda r: "[core]" in r.text or "[remote" in r.text,
             "Critical", ".git/config exposed — may allow full source-code download."),
            ("/.git/HEAD",        lambda r: r.text.strip().startswith("ref:") or
                                            bool(re.match(r"^[0-9a-f]{40}", r.text.strip())),
             "High", ".git/HEAD exposed — git repository is publicly accessible."),
            ("/database.sql",     lambda r: bool(re.search(r"CREATE TABLE|INSERT INTO", r.text, re.I)),
             "Critical", "Database SQL dump exposed."),
            ("/backup.sql",       lambda r: bool(re.search(r"CREATE TABLE|INSERT INTO", r.text, re.I)),
             "Critical", "SQL backup file exposed."),
            ("/wp-config.php",    lambda r: "DB_PASSWORD" in r.text or "DB_NAME" in r.text,
             "Critical", "WordPress config exposed — contains database credentials."),
            ("/config.php",       lambda r: bool(re.search(r"password|db_|database", r.text, re.I)),
             "Critical", "config.php exposed — may contain database credentials."),
            ("/web.config",       lambda r: "<configuration>" in r.text or "connectionString" in r.text,
             "High", "web.config (IIS) exposed."),
            ("/id_rsa",           lambda r: "-----BEGIN" in r.text and "PRIVATE KEY" in r.text,
             "Critical", "Private SSH key exposed."),
            ("/.aws/credentials", lambda r: "aws_access_key_id" in r.text.lower() or "[default]" in r.text,
             "Critical", "AWS credentials file exposed."),
            ("/phpinfo.php",      lambda r: "PHP Version" in r.text and "phpinfo()" in r.text,
             "High", "phpinfo() exposed — reveals full PHP/server configuration."),
            ("/info.php",         lambda r: "PHP Version" in r.text and "phpinfo()" in r.text,
             "High", "phpinfo() exposed."),
            ("/.htpasswd",        lambda r: bool(re.search(r"\w+:\$(apr1|2y|1)\$", r.text)),
             "Critical", ".htpasswd exposed — contains hashed passwords."),
            ("/docker-compose.yml", lambda r: "services:" in r.text or "version:" in r.text,
             "Medium", "docker-compose.yml exposed — reveals infrastructure layout."),
            ("/Dockerfile",       lambda r: "FROM " in r.text or "RUN " in r.text,
             "Medium", "Dockerfile exposed — reveals build configuration."),
            ("/.htaccess",        lambda r: bool(re.search(r"RewriteRule|AuthType|Require", r.text)),
             "Medium", ".htaccess exposed — reveals URL rewriting and access rules."),
            ("/backup.zip",       lambda r: r.content[:4] == b"PK\x03\x04",
             "Critical", "Backup ZIP archive publicly accessible."),
            ("/backup.tar.gz",    lambda r: r.content[:2] == b"\x1f\x8b",
             "Critical", "Backup tar.gz archive publicly accessible."),
            ("/composer.json",    lambda r: '"require"' in r.text or '"name"' in r.text,
             "Low", "composer.json exposed — reveals dependency versions."),
            ("/package.json",     lambda r: '"dependencies"' in r.text or '"name"' in r.text,
             "Low", "package.json exposed — reveals dependency versions."),
        ]

        for path, verify, severity, desc in paths:
            try:
                target = base_url.rstrip("/") + path
                resp = self.session.get(target, timeout=6, verify=False, allow_redirects=False)
                if resp.status_code != 200:
                    continue
                try:
                    if not verify(resp):
                        continue
                except Exception:
                    continue
                self._add({
                    "type": "Broken Access Control",
                    "severity": severity,
                    "url": target,
                    "description": f"Verified sensitive file accessible: {desc}",
                    "remediation": (
                        "Move the file outside the webroot, deny access via server config, "
                        "or delete it if unused."
                    ),
                })
            except Exception as exc:
                logger.debug("Sensitive file check failed %s: %s", path, exc)
                continue


    def scan_ports(self, host):
        ports = {
            21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP", 53: "DNS",
            80: "HTTP", 110: "POP3", 143: "IMAP", 443: "HTTPS",
            445: "SMB", 1433: "MSSQL", 1521: "Oracle", 3306: "MySQL",
            3389: "RDP", 5432: "PostgreSQL", 5900: "VNC",
            6379: "Redis", 8080: "HTTP-Alt", 8443: "HTTPS-Alt",
            9200: "Elasticsearch", 11211: "Memcached", 27017: "MongoDB",
        }

        open_ports = []
        for port, service in ports.items():
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(0.5)
                if sock.connect_ex((host, port)) == 0:
                    open_ports.append(f"{port}/{service}")
                    if service in ("FTP", "Telnet", "Redis", "Memcached",
                                   "Elasticsearch", "MongoDB"):
                        self._add({
                            "type": "Security Misconfiguration",
                            "severity": "High",
                            "url": f"{host}:{port}",
                            "description": (
                                f"{service} (port {port}) is internet-accessible "
                                f"and lacks built-in authentication."
                            ),
                            "remediation": (
                                f"Restrict {service} to localhost or a private network "
                                f"via firewall rules."
                            ),
                        })
                sock.close()
            except Exception as exc:
                logger.debug("Port scan failed %s:%s: %s", host, port, exc)
                continue

        if open_ports:
            self._add({
                "type": "Information Disclosure",
                "severity": "Info",
                "url": host,
                "description": f"Open ports: {', '.join(open_ports)}",
                "remediation": "Close or firewall unused ports.",
            })


    def check_ssl_tls(self, base_url):
        if "https://" not in base_url:
            return

        host = urlparse(base_url).hostname
        try:
            ctx = ssl.create_default_context()
            with socket.create_connection((host, 443), timeout=5) as raw:
                with ctx.wrap_socket(raw, server_hostname=host) as tls:
                    cert    = tls.getpeercert()
                    version = tls.version()

            if version in ("TLSv1", "TLSv1.1"):
                self._add({
                    "type": "Security Misconfiguration",
                    "severity": "High",
                    "url": base_url,
                    "description": f"Outdated TLS version in use: {version}.",
                    "remediation": "Disable TLS 1.0/1.1; enable TLS 1.2 and 1.3.",
                })

            not_after = cert.get("notAfter")
            if not_after:
                from datetime import datetime
                expiry = datetime.strptime(not_after, "%b %d %H:%M:%S %Y %Z")
                days   = (expiry - datetime.utcnow()).days
                if days < 30:
                    self._add({
                        "type": "Security Misconfiguration",
                        "severity": "Critical" if days < 7 else "Medium",
                        "url": base_url,
                        "description": f"SSL certificate expires in {days} day(s).",
                        "remediation": "Renew the SSL certificate before it expires.",
                    })

            subj = dict(x[0] for x in cert.get("subject", []))
            if subj.get("commonName") and subj["commonName"] != host:
                self._add({
                    "type": "Security Misconfiguration",
                    "severity": "Medium",
                    "url": base_url,
                    "description": (
                        f"SSL certificate hostname mismatch: "
                        f"certificate is for '{subj['commonName']}', not '{host}'."
                    ),
                    "remediation": "Obtain a certificate that covers the correct hostname.",
                })
        except Exception as exc:
            self._add({
                "type": "Security Misconfiguration",
                "severity": "High",
                "url": base_url,
                "description": f"SSL/TLS connection failed: {exc}",
                "remediation": "Verify SSL configuration and certificate chain.",
            })


    def check_directory_listing(self, base_url):
        dirs = [
            "/uploads/", "/files/", "/images/", "/documents/", "/downloads/",
            "/backup/", "/temp/", "/logs/", "/data/", "/media/", "/static/",
            "/assets/", "/vendor/", "/src/", "/lib/", "/dist/", "/build/",
            "/admin/", "/private/", "/config/",
        ]
        indicators = (
            "index of", "parent directory", "directory listing",
            "<title>index of", "<h1>index of", "last modified",
        )

        for d in dirs:
            try:
                target = base_url.rstrip("/") + d
                resp   = self._get(target)
                text   = resp.text.lower()
                if resp.status_code == 200 and any(ind in text for ind in indicators):
                    sev = "High" if any(
                        ext in text for ext in (".env", ".git", ".sql", ".bak")
                    ) else "Medium"
                    self._add({
                        "type": "Security Misconfiguration",
                        "severity": sev,
                        "url": target,
                        "description": f"Directory listing is enabled for {d}.",
                        "remediation": (
                            "Disable the Options Indexes directive in Apache, or "
                            "the autoindex module in Nginx."
                        ),
                    })
            except Exception as exc:
                logger.debug("Directory listing check failed %s: %s", d, exc)
                continue


    def check_cors_misconfiguration(self, base_url):
        probes = [
            ("https://evil.com", True),
            ("null", True),
            ("http://localhost", True),
            ("http://127.0.0.1", True),
        ]

        wildcard_reported    = False
        reflection_reported  = False
        credentials_reported = False

        for origin, should_warn in probes:
            try:
                resp = self._get(base_url, headers={"Origin": origin})
                acao = resp.headers.get("Access-Control-Allow-Origin", "")

                if acao == "*" and not wildcard_reported:
                    self._add({
                        "type": "Security Misconfiguration",
                        "severity": "Medium",
                        "url": base_url,
                        "description": "CORS policy allows wildcard origin (*).",
                        "remediation": "Restrict Access-Control-Allow-Origin to specific trusted domains.",
                    })
                    wildcard_reported = True

                if acao == origin and should_warn and not reflection_reported:
                    self._add({
                        "type": "Security Misconfiguration",
                        "severity": "High",
                        "url": base_url,
                        "description": "CORS policy blindly reflects the request Origin header.",
                        "remediation": "Maintain an explicit whitelist of allowed origins.",
                    })
                    reflection_reported = True

                if (resp.headers.get("Access-Control-Allow-Credentials") == "true"
                        and acao == "*"
                        and not credentials_reported):
                    self._add({
                        "type": "Security Misconfiguration",
                        "severity": "Critical",
                        "url": base_url,
                        "description": "CORS allows credentials with a wildcard origin.",
                        "remediation": "Never combine Allow-Credentials: true with a wildcard origin.",
                    })
                    credentials_reported = True

            except Exception as exc:
                logger.debug("CORS check failed %s: %s", origin, exc)
                continue


    def check_technology_stack(self, base_url):
        try:
            resp = self._get(base_url)
            html = resp.text.lower()
            hdrs = resp.headers

            if "wp-content" in html or "wp-includes" in html:
                self._add({
                    "type": "Information Disclosure",
                    "severity": "Info",
                    "url": base_url,
                    "description": "WordPress CMS detected.",
                    "remediation": "Keep WordPress core, plugins, and themes updated.",
                })
                for wp_path in ("/xmlrpc.php", "/wp-login.php"):
                    try:
                        wp_resp = self._get(base_url.rstrip("/") + wp_path)
                        if wp_resp.status_code == 200 and wp_path == "/xmlrpc.php":
                            self._add({
                                "type": "Security Misconfiguration",
                                "severity": "Medium",
                                "url": base_url.rstrip("/") + wp_path,
                                "description": "WordPress XML-RPC is enabled — can be abused for brute-force or DDoS.",
                                "remediation": "Disable XML-RPC via plugin or server rule unless actively needed.",
                            })
                    except Exception as exc:
                        logger.debug("WP path check failed %s: %s", wp_path, exc)
                        continue

            if "laravel" in hdrs.get("Set-Cookie", "").lower():
                self._add({
                    "type": "Information Disclosure",
                    "severity": "Info",
                    "url": base_url,
                    "description": "Laravel PHP framework fingerprinted via session cookie.",
                    "remediation": "Rename the session cookie to a generic name.",
                })

            if any(tok in html for tok in ("stack trace", "traceback", "exception in thread")):
                self._add({
                    "type": "Information Disclosure",
                    "severity": "High",
                    "url": base_url,
                    "description": "Application debug output (stack trace) is visible in the page.",
                    "remediation": "Disable debug mode in production and log errors server-side only.",
                })
        except Exception as exc:
            logger.debug("Technology stack check failed %s: %s", base_url, exc)


    def run(self, base_url):
        parsed_host = urlparse(base_url).hostname or base_url

        self.scan_ports(parsed_host)
        self.check_sensitive_files(base_url)
        self.check_directory_listing(base_url)
        self.check_ssl_tls(base_url)
        self.check_cors_misconfiguration(base_url)
        self.check_technology_stack(base_url)

        for page in self.pages_data:
            self.check_security_headers(page["url"])
            self.check_xss_vulnerability(page)
            self.check_sql_injection(page)
            time.sleep(0.4)

        return list(self.vulnerabilities)