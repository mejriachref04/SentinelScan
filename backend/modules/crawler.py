import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse


class Crawler:


    def __init__(self, base_url: str, max_pages: int = 50):
        self.base_url  = base_url
        self.max_pages = max_pages
        self.visited   = set()
        self.queue     = [base_url]
        self.pages     = []
        self.on_page_discovered = None

        self._session = requests.Session()
        self._session.headers["User-Agent"] = "SentinelScan/1.0"
        self._session.max_redirects = 5

    def _same_domain(self, url: str) -> bool:
        p = urlparse(url)
        b = urlparse(self.base_url)
        return bool(p.netloc) and p.netloc == b.netloc

    def _extract_links(self, html: str, current_url: str) -> list:
        soup  = BeautifulSoup(html, "html.parser")
        links = []
        for tag in soup.find_all("a", href=True):
            full = urljoin(current_url, tag["href"]).split("#")[0].rstrip("/")
            if self._same_domain(full):
                links.append(full)
        return links

    def _record_page(self, url: str, html: str):
        soup = BeautifulSoup(html, "html.parser")
        entry = {
            "url":    url,
            "title":  soup.title.string if soup.title else "",
            "forms":  len(soup.find_all("form")),
            "inputs": len(soup.find_all("input")),
        }
        self.pages.append(entry)
        if self.on_page_discovered:
            self.on_page_discovered(entry)
        return entry

    _PROBE_FILES = [
        "/backup.zip", "/backup.tar.gz", "/db.sql", "/database.sql",
        "/config.bak", "/config.old", "/.env", "/.git/HEAD",
    ]

    _PROBE_DIRS = [
        "/uploads/", "/files/", "/images/", "/documents/", "/downloads/",
    ]

    def _probe_static_paths(self):
        for path in self._PROBE_FILES:
            target = self.base_url.rstrip("/") + path
            if target in self.visited:
                continue
            try:
                resp = self._session.get(target, timeout=4)
                if resp.status_code == 200:
                    self._record_page(target, resp.text)
            except requests.TooManyRedirects:
                pass
            except Exception:
                pass

        for path in self._PROBE_DIRS:
            target = self.base_url.rstrip("/") + path
            if target in self.visited:
                continue
            try:
                resp = self._session.get(target, timeout=4)
                if resp.status_code == 200 and "Index of" in resp.text:
                    self._record_page(target, resp.text)
            except requests.TooManyRedirects:
                pass
            except Exception:
                pass

    def run(self) -> list:
        while self.queue and len(self.visited) < self.max_pages:
            url = self.queue.pop(0)
            if url in self.visited:
                continue
            self.visited.add(url)
            try:
                resp = self._session.get(url, timeout=5)
                if resp.status_code != 200:
                    continue
                self._record_page(url, resp.text)
                for link in self._extract_links(resp.text, url):
                    if link not in self.visited and link not in self.queue:
                        self.queue.append(link)
            except requests.TooManyRedirects:
                continue
            except Exception:
                continue

        self._probe_static_paths()
        return self.pages