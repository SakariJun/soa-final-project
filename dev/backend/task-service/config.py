import os

basedir = os.path.abspath(os.path.dirname(__file__))
if not os.path.exists("logs/"):
    os.makedirs("logs/")
if not os.path.exists("temp/"):
    os.makedirs("temp/")

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "207f8bb92f0dca5e50bb4929bce85865223bd6e64c1a003a134edc5c47e4d99e"

    MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.googlemail.com")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", "587"))
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS",
                                  "true").lower() in ["true", "on", "1"]
    MAIL_USERNAME = os.environ.get(
        "MAIL_USERNAME") or "thinhtruong04012001@gmail.com"
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD") or "ggasrnxqxqrwntuz"

    MAIL_SUBJECT_PREFIX = os.environ.get("MAIL_SUBJECT_PREFIX") or "[TAT-Business]"
    MAIL_SENDER = os.environ.get("MAIL_SENDER") or "TAT-Business Admin"
    ADMIN = os.environ.get("ADMIN") or 'Administrator'

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
    MONGODB_SETTINGS = [{
        "db": "tatbusiness",
        "host": "localhost",
        "port": 27017,
        "alias": "default",
    }]


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
