import json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(80),  unique=True, nullable=False)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role          = db.Column(db.String(20),  default="user")
    suspended     = db.Column(db.Boolean,     default=False)

    scans           = db.relationship("Scan",          backref="owner", lazy=True)
    scheduled_scans = db.relationship("ScheduledScan", backref="owner", lazy=True)


class Scan(db.Model):
    id           = db.Column(db.Integer,  primary_key=True)
    url          = db.Column(db.String(500), nullable=False)
    risk_score   = db.Column(db.Integer)
    timestamp    = db.Column(db.DateTime, default=datetime.utcnow)
    results_json = db.Column(db.Text,     nullable=False)
    user_id      = db.Column(db.Integer,  db.ForeignKey("user.id"), nullable=False)

    def to_dict(self):
        return {
            "id":         self.id,
            "url":        self.url,
            "risk_score": self.risk_score,
            "timestamp":  self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "results":    json.loads(self.results_json),
        }

    def diff_with(self, other: "Scan") -> dict:

        def key(v):
            return f"{v.get('type')}|{v.get('url')}|{v.get('severity')}"

        current  = {key(v): v for v in json.loads(self.results_json)}
        previous = {key(v): v for v in json.loads(other.results_json)}

        fixed     = [v for k, v in previous.items() if k not in current]
        new_vulns = [v for k, v in current.items()  if k not in previous]
        persisted = [v for k, v in current.items()  if k in previous]

        return {
            "current_scan_id":    self.id,
            "previous_scan_id":   other.id,
            "current_timestamp":  self.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "previous_timestamp": other.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "risk_delta":         self.risk_score - other.risk_score,
            "current_risk":       self.risk_score,
            "previous_risk":      other.risk_score,
            "fixed":              fixed,
            "new":                new_vulns,
            "persisted":          persisted,
            "summary": {
                "fixed_count":     len(fixed),
                "new_count":       len(new_vulns),
                "persisted_count": len(persisted),
            },
        }


class ScheduledScan(db.Model):
    id             = db.Column(db.Integer,  primary_key=True)
    url            = db.Column(db.String(500), nullable=False)
    user_id        = db.Column(db.Integer,  db.ForeignKey("user.id"), nullable=False)
    schedule_type  = db.Column(db.String(20),  nullable=False)   
    interval_hours = db.Column(db.Integer,  nullable=True)
    daily_time     = db.Column(db.String(5),   nullable=True)    
    is_active      = db.Column(db.Boolean,  default=True)
    created_at     = db.Column(db.DateTime, default=datetime.utcnow)
    last_run       = db.Column(db.DateTime, nullable=True)
    next_run       = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "id":             self.id,
            "url":            self.url,
            "user_id":        self.user_id,
            "schedule_type":  self.schedule_type,
            "interval_hours": self.interval_hours,
            "daily_time":     self.daily_time,
            "is_active":      self.is_active,
            "created_at":     self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "last_run":       self.last_run.strftime("%Y-%m-%d %H:%M:%S") if self.last_run else None,
            "next_run":       self.next_run.strftime("%Y-%m-%d %H:%M:%S") if self.next_run else None,
        }