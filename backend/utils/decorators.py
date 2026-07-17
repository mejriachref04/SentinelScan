from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models import User


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            verify_jwt_in_request()
            user = User.query.get(int(get_jwt_identity()))
            if user and user.role == "admin":
                return fn(*args, **kwargs)
            return jsonify({"msg": "Admin access required."}), 403
        return decorated
    return wrapper