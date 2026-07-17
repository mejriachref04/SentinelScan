import re
import logging

logger = logging.getLogger(__name__)


SEVERITY_WEIGHT = {
    "Critical": 10,
    "High":      7,
    "Medium":    4,
    "Low":       1,
    "Info":      0,
}

RULES = {
    "Injection (SQL)": {
        "impact": (
            "Full database read, modification, or deletion is possible. In some server "
            "configurations this escalates to OS command execution and complete server "
            "takeover. Practical outcomes include data breaches, authentication bypass, "
            "and ransomware staging."
        ),
        "explanation": (
            "SQL injection happens when user input is concatenated directly into a query "
            "string. The database cannot tell the difference between your intended SQL and "
            "the injected payload, so it executes both."
        ),
        "priority": (
            "CRITICAL — do not deploy until resolved. This class of vulnerability is "
            "consistently in the top three most-exploited web weaknesses year over year."
        ),
        "remediation": (
            "1. Switch every query to parameterised statements or prepared statements — "
            "no exceptions.\n"
            "2. Use an ORM (SQLAlchemy, Django ORM, Hibernate) which handles this "
            "automatically.\n"
            "3. Apply input validation: reject values that don't match the expected format "
            "(integer IDs, email patterns, etc.).\n"
            "4. Grant the database account only the minimum privileges the app actually "
            "needs (SELECT/INSERT, never DROP or FILE).\n"
            "5. Deploy a Web Application Firewall as a secondary layer, not a replacement "
            "for the above."
        ),
        "cwe":   "CWE-89: Improper Neutralisation of Special Elements in SQL Commands",
        "owasp": "A03:2021 – Injection",
        "references": [
            "https://owasp.org/Top10/A03_2021-Injection/",
            "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
        ],
    },

    "Injection (XSS)": {
        "impact": (
            "An attacker can steal session cookies and hijack accounts, silently redirect "
            "users to phishing pages, perform state-changing actions on their behalf, or "
            "install a keylogger running in their browser tab. Stored XSS affects every "
            "user who visits the page."
        ),
        "explanation": (
            "Cross-site scripting occurs when user-controlled input reaches the browser "
            "without HTML encoding. The browser treats the injected content as executable "
            "script rather than data, giving the attacker a JavaScript foothold inside the "
            "victim's authenticated session."
        ),
        "priority": (
            "HIGH — schedule for the next development sprint. Any user visiting the "
            "affected page is at risk of session hijacking right now."
        ),
        "remediation": (
            "1. HTML-encode all user-supplied output before rendering: escape <, >, \", ', &.\n"
            "2. Use a framework that auto-escapes by default (React JSX, Angular, Jinja2 "
            "with autoescape=True).\n"
            "3. Add a strict Content-Security-Policy header to block inline script execution.\n"
            "4. Never trust client-side validation — always re-validate on the server.\n"
            "5. Set HTTPOnly and Secure flags on session cookies to limit the damage if XSS "
            "does occur."
        ),
        "cwe":   "CWE-79: Improper Neutralisation of Input During Web Page Generation",
        "owasp": "A03:2021 – Injection",
        "references": [
            "https://owasp.org/Top10/A03_2021-Injection/",
            "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html",
        ],
    },

    "Broken Access Control": {
        "impact": (
            "Sensitive files often contain database passwords, API keys, or private keys. "
            "An attacker who downloads them can pivot to full system compromise, including "
            "database access and credential-stuffing against other services."
        ),
        "explanation": (
            "Development artifacts (.env, .git, SQL dumps) ended up in the webroot and "
            "are accessible without authentication. Automated scanners hit these paths "
            "within minutes of a deployment."
        ),
        "priority": (
            "CRITICAL — remove or block access to these files immediately. Rotate any "
            "secrets that may have been exposed."
        ),
        "remediation": (
            "1. Move all config and credential files outside the webroot entirely.\n"
            "2. Add server-level deny rules for .env, .git, *.sql, *.bak, and *.old "
            "extensions.\n"
            "3. Audit your CI/CD pipeline to make sure dev artifacts aren't published to "
            "production.\n"
            "4. Rotate every secret (DB password, API key, token) that was in any exposed "
            "file.\n"
            "5. Add these paths to .gitignore to prevent future commits."
        ),
        "cwe":   "CWE-284: Improper Access Control",
        "owasp": "A01:2021 – Broken Access Control",
        "references": [
            "https://owasp.org/Top10/A01_2021-Broken_Access_Control/",
        ],
    },

    "Security Misconfiguration": {
        "impact": (
            "Missing headers leave users exposed to clickjacking, MIME-sniffing attacks, "
            "SSL stripping, and cross-origin data leaks. Misconfigured CORS can allow a "
            "malicious site to silently make authenticated requests on behalf of your users."
        ),
        "explanation": (
            "The server is missing standard security hardening. These headers are a "
            "low-effort, high-impact defence layer that instructs the browser how to "
            "handle your content safely. They take under 30 minutes to add and protect "
            "against entire classes of well-known attacks."
        ),
        "priority": (
            "MEDIUM — address in the next deployment window. Most of these are one-line "
            "config changes."
        ),
        "remediation": (
            "1. Strict-Transport-Security: max-age=31536000; includeSubDomains\n"
            "2. Content-Security-Policy: define a restrictive policy for your app.\n"
            "3. X-Frame-Options: DENY\n"
            "4. X-Content-Type-Options: nosniff\n"
            "5. Referrer-Policy: strict-origin-when-cross-origin\n"
            "6. Remove or anonymise the Server response header.\n"
            "7. Validate your headers at observatory.mozilla.org after deploying."
        ),
        "cwe":   "CWE-16: Configuration",
        "owasp": "A05:2021 – Security Misconfiguration",
        "references": [
            "https://owasp.org/Top10/A05_2021-Security_Misconfiguration/",
            "https://observatory.mozilla.org/",
        ],
    },

    "Information Disclosure": {
        "impact": (
            "Exposed server banners and technology versions let an attacker skip "
            "fingerprinting and go straight to researching known CVEs for your exact "
            "software stack. It's low effort for them and meaningfully shortens the "
            "attack timeline."
        ),
        "explanation": (
            "The server or application reveals details about its internal technology — "
            "software versions, open ports, or framework identifiers. This information "
            "isn't directly exploitable on its own, but it makes every subsequent attack "
            "cheaper."
        ),
        "priority": (
            "LOW — informational risk. Handle after higher-severity findings are "
            "addressed."
        ),
        "remediation": (
            "1. Suppress or replace the Server header (set it to a generic string).\n"
            "2. Remove X-Powered-By and X-AspNet-Version headers.\n"
            "3. Disable directory listing at the web-server level.\n"
            "4. Ensure error pages don't return stack traces or internal file paths.\n"
            "5. Close unused network ports via firewall rules."
        ),
        "cwe":   "CWE-200: Exposure of Sensitive Information to an Unauthorised Actor",
        "owasp": "A05:2021 – Security Misconfiguration",
        "references": [
            "https://cwe.mitre.org/data/definitions/200.html",
        ],
    },
}


def _enrich(base: dict, finding: dict) -> dict:
    result = dict(base)
    desc = finding.get("description", "")
    url  = finding.get("url", "")
    sev  = finding.get("severity", "Medium")

    m = re.search(r"parameter ['\"]?(\w+)['\"]?", desc, re.IGNORECASE)
    if m:
        result["explanation"] += f" The affected parameter is '{m.group(1)}'."
    if url:
        result["explanation"] += f" Affected endpoint: {url}"

    result["risk_weight"] = SEVERITY_WEIGHT.get(sev, 1)
    result["engine"]      = "SentinelScan Analysis Engine v1.0"
    return result


class SecurityAnalysisEngine:


    def __init__(self):
        self.engine_version = "1.0"
        logger.info("SecurityAnalysisEngine ready (rule-based, deterministic)")

    def analyze_finding(self, finding: dict) -> dict:
        v_type = finding.get("type", "Unknown")
        sev    = finding.get("severity", "Medium")
        desc   = finding.get("description", "")

        base = RULES.get(v_type)
        if base:
            return _enrich(base, finding)

        return {
            "impact": (
                f"A {sev.lower()}-severity weakness that warrants investigation and "
                f"remediation according to your security policy."
            ),
            "explanation": (
                desc or "The scanner detected an anomaly that may indicate a security weakness."
            ),
            "priority": f"{sev} — evaluate against your threat model.",
            "remediation": (
                "1. Reproduce and confirm the finding manually.\n"
                "2. Review the relevant OWASP guideline for this category.\n"
                "3. Apply least-privilege and defence-in-depth principles."
            ),
            "cwe":   "Unknown — manual classification required",
            "owasp": "See OWASP Top 10 (2021) for the relevant category",
            "references": ["https://owasp.org/Top10/"],
            "risk_weight": SEVERITY_WEIGHT.get(sev, 1),
            "engine": "SentinelScan Analysis Engine v1.0",
        }

AIEngine = SecurityAnalysisEngine