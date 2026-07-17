import uuid
import logging
from datetime import timedelta

import bcrypt
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, get_jwt_identity, jwt_required, decode_token,
)
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_socketio import SocketIO, emit, join_room

from config import Config
from models import db, User
from modules.scan_manager import ScanManager
from modules.reporter import ReportGenerator
from utils.decorators import admin_required
from utils.url_validator import validate_scan_target

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000", async_mode="threading")
jwt     = JWTManager(app)
db.init_app(app)

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=[],
    storage_uri="memory://",
)

scan_manager = ScanManager(socketio, app)



@socketio.on("connect")
def on_connect():
    logger.info("Client connected: %s", request.sid)


@socketio.on("authenticate")
def on_authenticate(data):
    token   = data.get("token")
    user_id = data.get("user_id")
    if not token or not user_id:
        emit("authenticated", {"status": "error", "message": "Missing token or user_id."})
        return
    try:
        decoded = decode_token(token)
        if decoded["sub"] == str(user_id):
            join_room(f"user_{user_id}")
            emit("authenticated", {"status": "success", "user_id": user_id})
            logger.info("User %s authenticated on socket %s", user_id, request.sid)
        else:
            emit("authenticated", {"status": "error", "message": "Token does not match user."})
    except Exception as exc:
        logger.error("Auth error: %s", exc)
        emit("authenticated", {"status": "error", "message": str(exc)})


@socketio.on("start_scan")
def on_start_scan(data):
    target_url = data.get("url")
    user_id    = data.get("user_id")
    token      = data.get("token")

    if not all([target_url, user_id, token]):
        emit("error", {"message": "url, user_id, and token are all required."})
        return

    valid, err = validate_scan_target(target_url)
    if not valid:
        emit("error", {"message": f"Invalid target: {err}"})
        return

    try:
        decoded = decode_token(token)
        if decoded["sub"] != str(user_id):
            emit("error", {"message": "Token does not match the supplied user_id."})
            return
    except Exception:
        emit("error", {"message": "Invalid or expired token."})
        return

    scan_id = str(uuid.uuid4())
    room = f"user_{user_id}"

    emit("scan_started", {"scan_id": scan_id, "url": target_url})
    scan_manager.start_scan(scan_id, target_url, user_id, room)
    logger.info("Scan %s started for %s by user %s", scan_id, target_url, user_id)


@socketio.on("disconnect")
def on_disconnect():
    logger.info("Client disconnected: %s", request.sid)



@app.route("/api/auth/register", methods=["POST"])
@limiter.limit("10 per hour")
def register():
    data = request.json
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "An account with that email already exists."}), 400

    hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt()).decode()
    user   = User(
        username=data["username"],
        email=data["email"],
        password_hash=hashed,
        role="user",
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Account created successfully."}), 201


@app.route("/api/auth/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()

    if user and user.suspended:
        return jsonify({"msg": "This account has been suspended."}), 403

    if user and bcrypt.checkpw(data["password"].encode(), user.password_hash.encode()):
        token = create_access_token(
            identity=str(user.id), expires_delta=timedelta(days=1)
        )
        return jsonify({
            "token": token,
            "user":  {"id": user.id, "username": user.username, "role": user.role},
        }), 200

    return jsonify({"msg": "Invalid email or password."}), 401



@app.route("/api/scan/history", methods=["GET"])
@jwt_required()
def scan_history():
    from models import Scan
    user_id = int(get_jwt_identity())
    scans   = Scan.query.filter_by(user_id=user_id).order_by(Scan.timestamp.desc()).all()
    return jsonify([s.to_dict() for s in scans]), 200


@app.route("/api/scan/diff/<int:scan_id>", methods=["GET"])
@jwt_required()
def scan_diff_vs_previous(scan_id):
    from models import Scan
    user_id = int(get_jwt_identity())

    current = Scan.query.filter_by(id=scan_id, user_id=user_id).first()
    if not current:
        return jsonify({"msg": "Scan not found."}), 404

    previous = (
        Scan.query
        .filter_by(url=current.url, user_id=user_id)
        .filter(Scan.id < scan_id)
        .order_by(Scan.id.desc())
        .first()
    )
    if not previous:
        return jsonify({"msg": "No previous scan found for this URL."}), 404

    return jsonify(current.diff_with(previous)), 200


@app.route("/api/scan/diff/<int:scan_a>/<int:scan_b>", methods=["GET"])
@jwt_required()
def scan_diff_manual(scan_a, scan_b):
    from models import Scan
    user_id = int(get_jwt_identity())

    a = Scan.query.filter_by(id=scan_a, user_id=user_id).first()
    b = Scan.query.filter_by(id=scan_b, user_id=user_id).first()
    if not a or not b:
        return jsonify({"msg": "One or both scans not found."}), 404

    newer, older = (a, b) if a.id > b.id else (b, a)

    if newer.url != older.url:
        return jsonify({"msg": "Cannot compare scans from different URLs."}), 400

    return jsonify(newer.diff_with(older)), 200


@app.route("/api/scan/report", methods=["POST"])
@jwt_required()
def generate_report():
    data   = request.json
    buffer = ReportGenerator.create_pdf(data)
    return send_file(
        buffer,
        as_attachment=True,
        download_name="SentinelScan_Report.pdf",
        mimetype="application/pdf",
    )



@app.route("/api/schedule", methods=["GET"])
@jwt_required()
def list_schedules():
    from models import ScheduledScan
    user_id   = int(get_jwt_identity())
    schedules = (
        ScheduledScan.query
        .filter_by(user_id=user_id)
        .order_by(ScheduledScan.created_at.desc())
        .all()
    )
    return jsonify([s.to_dict() for s in schedules]), 200


@app.route("/api/schedule", methods=["POST"])
@jwt_required()
def create_schedule():
    from models import ScheduledScan
    from scheduler import ScanScheduler
    user_id = int(get_jwt_identity())
    data    = request.json

    url           = (data.get("url") or "").strip()
    schedule_type = data.get("schedule_type")

    if not url:
        return jsonify({"msg": "URL is required."}), 400
    if schedule_type not in ("interval", "daily"):
        return jsonify({"msg": "schedule_type must be 'interval' or 'daily'."}), 400

    valid, err = validate_scan_target(url)
    if not valid:
        return jsonify({"msg": f"Invalid URL: {err}"}), 400

    interval_hours = data.get("interval_hours")
    daily_time     = data.get("daily_time")

    if schedule_type == "interval" and not interval_hours:
        return jsonify({"msg": "interval_hours is required for interval schedules."}), 400
    if schedule_type == "daily" and not daily_time:
        return jsonify({"msg": "daily_time is required for daily schedules."}), 400

    next_run = ScanScheduler.compute_first_run(schedule_type, interval_hours, daily_time)

    schedule = ScheduledScan(
        url=url,
        user_id=user_id,
        schedule_type=schedule_type,
        interval_hours=int(interval_hours) if interval_hours else None,
        daily_time=daily_time,
        is_active=True,
        next_run=next_run,
    )
    db.session.add(schedule)
    db.session.commit()
    return jsonify(schedule.to_dict()), 201


@app.route("/api/schedule/<int:schedule_id>", methods=["DELETE"])
@jwt_required()
def delete_schedule(schedule_id):
    from models import ScheduledScan
    user_id  = int(get_jwt_identity())
    schedule = ScheduledScan.query.filter_by(id=schedule_id, user_id=user_id).first()
    if not schedule:
        return jsonify({"msg": "Schedule not found."}), 404
    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"msg": "Schedule deleted."}), 200


@app.route("/api/schedule/<int:schedule_id>/toggle", methods=["POST"])
@jwt_required()
def toggle_schedule(schedule_id):
    from models import ScheduledScan
    from scheduler import ScanScheduler
    user_id  = int(get_jwt_identity())
    schedule = ScheduledScan.query.filter_by(id=schedule_id, user_id=user_id).first()
    if not schedule:
        return jsonify({"msg": "Schedule not found."}), 404

    schedule.is_active = not schedule.is_active
    if schedule.is_active:
        schedule.next_run = ScanScheduler.compute_first_run(
            schedule.schedule_type, schedule.interval_hours, schedule.daily_time
        )
    db.session.commit()
    return jsonify(schedule.to_dict()), 200



@app.route("/api/admin/users", methods=["GET"])
@jwt_required()
@admin_required()
def admin_list_users():
    users = User.query.all()
    return jsonify([
        {"id": u.id, "username": u.username, "email": u.email, "role": u.role, "suspended": u.suspended}
        for u in users
    ]), 200


@app.route("/api/admin/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
@admin_required()
def admin_delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found."}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted."}), 200


@app.route("/api/admin/users/<int:user_id>/suspend", methods=["POST"])
@jwt_required()
@admin_required()
def admin_suspend_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found."}), 404
    user.suspended = True
    db.session.commit()
    return jsonify({"msg": "User suspended."}), 200


@app.route("/api/admin/users/<int:user_id>/unsuspend", methods=["POST"])
@jwt_required()
@admin_required()
def admin_unsuspend_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found."}), 404
    user.suspended = False
    db.session.commit()
    return jsonify({"msg": "User unsuspended."}), 200


@app.route("/api/admin/users/<int:user_id>/scans", methods=["GET"])
@jwt_required()
@admin_required()
def admin_user_scans(user_id):
    from models import Scan
    scans = Scan.query.filter_by(user_id=user_id).order_by(Scan.timestamp.desc()).all()
    return jsonify([s.to_dict() for s in scans]), 200



with app.app_context():
    db.create_all()
    if not User.query.filter_by(username="admin").first():
        pwd    = app.config.get("ADMIN_PASSWORD", "sentinaladdmin")
        hashed = bcrypt.hashpw(pwd.encode(), bcrypt.gensalt()).decode()
        admin  = User(username="admin", email="admin@sentinel.com", password_hash=hashed, role="admin")
        db.session.add(admin)
        db.session.commit()
        logger.info("Default admin account created.")

import os as _os
if not app.debug or _os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    from scheduler import ScanScheduler
    _scheduler = ScanScheduler(app, socketio, scan_manager)
    _scheduler.start()


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)