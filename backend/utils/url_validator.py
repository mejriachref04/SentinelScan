import re
import socket
import ipaddress
from urllib.parse import urlparse

_BLOCKED_RANGES = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),    
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("0.0.0.0/8"),
    ipaddress.ip_network("100.64.0.0/10"),     
    ipaddress.ip_network("240.0.0.0/4"),       
]

_BLOCKED_HOSTS = {
    "localhost",
    "ip6-localhost",
    "ip6-loopback",
    "metadata.google.internal",
    "169.254.169.254",
}


def validate_scan_target(url: str) -> tuple:

    if not url or not isinstance(url, str):
        return False, "URL is required."

    url = url.strip()

    if not re.match(r"^https?://", url, re.IGNORECASE):
        return False, "URL must begin with http:// or https://."

    try:
        parsed = urlparse(url)
    except Exception:
        return False, "URL format is invalid."

    hostname = parsed.hostname
    if not hostname:
        return False, "URL contains no hostname."

    if parsed.scheme.lower() not in ("http", "https"):
        return False, "Only http and https URLs are accepted."

    if hostname.lower() in _BLOCKED_HOSTS:
        return False, f"Scanning internal host '{hostname}' is not permitted."

    if len(url) > 500:
        return False, "URL exceeds the 500-character limit."

    try:
        ip = ipaddress.ip_address(socket.gethostbyname(hostname))

        for blocked in _BLOCKED_RANGES:
            if ip in blocked:
                return False, f"The target resolves to a private/internal IP ({ip}), which cannot be scanned."

        if ip.is_loopback:
            return False, "Scanning loopback addresses is not permitted."
        if ip.is_link_local:
            return False, "Scanning link-local addresses is not permitted."
        if ip.is_reserved:
            return False, "Scanning reserved IP addresses is not permitted."

    except socket.gaierror:
        return False, f"Hostname '{hostname}' could not be resolved — check the URL."
    except ValueError:
        return False, "The resolved IP address is invalid."

    return True, ""