import os
import logging

basedir = os.path.abspath(os.path.dirname(__file__))
if not os.path.exists("logs/"):
    os.makedirs("logs/")
if not os.path.exists("temp/"):
    os.makedirs("temp/")

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "The string that nobody knows"

    MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.googlemail.com")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", "587"))
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS",
                                  "true").lower() in ["true", "on", "1"]
    MAIL_USERNAME = os.environ.get(
        "MAIL_USERNAME") or "thinhtruong04012001@gmail.com"
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD") or "ggasrnxqxqrwntuz"

    MAIL_SUBJECT_PREFIX = "[TAT-Business]"
    MAIL_SENDER = "TAT-Business Admin"
    ADMIN = os.environ.get("FLASKY_ADMIN") or 'Administrator'

    STORAGE_BUCKET = os.environ.get(
        "STORAGE_BUCKET") or 'tat-business.appspot.com'

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # max size of files uploaded to database is 5MB
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024
    
    TASK_PER_PAGE = 10

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    MONGODB_SETTINGS = [{
        "db": "tatbusiness",
        "host": "localhost",
        "port": 27017,
        "alias": "default",
    }]


class ProductionConfig(Config):
    MONGODB_SETTINGS = os.environ.get(
        "DATABASE_URL") or "mongodb://localhost:27017"
    MONGODB_DB = "tatbusiness"


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
