import os
from datetime import timedelta

def _require(key):
    value = os.environ.get(key)
    return value

class Config:
    SECRET_KEY     = _require('SECRET_KEY')
    JWT_SECRET_KEY = _require('JWT_SECRET_KEY')
    ADMIN_PASSWORD = _require('ADMIN_PASSWORD')

    SQLALCHEMY_DATABASE_URI        = os.environ.get('DATABASE_URL', 'sqlite:///sentinelscan.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    JWT_TOKEN_LOCATION       = ['headers']
    JWT_HEADER_NAME          = 'Authorization'
    JWT_HEADER_TYPE          = 'Bearer'