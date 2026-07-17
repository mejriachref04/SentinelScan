# SentinelScan 🛡️

Automated web vulnerability scanner based on the OWASP Top 10 — built as a Final Year Project (PFE) at the Faculty of Sciences and Techniques of Sidi Bouzid, University of Kairouan.

## Features
- BFS crawler with configurable page limit
- SQL Injection detection (error-based, boolean-based, time-based)
- Reflected XSS detection
- HTTP security headers audit
- SSL/TLS configuration checks
- Sensitive file exposure detection (.env, .git, backups)
- Open port scanning
- CORS misconfiguration detection
- Real-time scan progress via WebSocket
- Automatic scheduled scans
- Scan comparison (diff between two audits)
- PDF report generation
- JWT authentication with role-based access control (RBAC)
- Built-in SSRF protection

## Tech Stack
**Backend:** Flask, SQLAlchemy, Flask-SocketIO, Flask-JWT-Extended, bcrypt, ReportLab, BeautifulSoup4
**Frontend:** React, Socket.IO client, Axios, Tailwind CSS


## Setup

### Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# edit .env with your own secret values
python app.py
Runs on http://localhost:5000

### Frontend
cd frontend
npm install
npm start
Runs on http://localhost:3000

## ⚠️ Legal & Ethical Notice
This tool is intended for authorized security testing only — your own applications, environments where you have explicit written permission, or dedicated test targets (DVWA, WebGoat). Scanning systems without authorization is illegal in most jurisdictions, including under Tunisian law (Organic Law n° 2004-5).

## Authors
- Mejri Achref
- Dhimi Ayoub

Academic supervisor: Taher Jellali · Professional supervisor: Tasnim Nouioui
=======
# SentinelScan
Automated web vulnerability scanner — PFE project (Flask + React)
