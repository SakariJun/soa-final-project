import os

basedir = os.path.abspath(os.path.dirname(__file__))
if not os.path.exists("logs/"):
    os.makedirs("logs/")
if not os.path.exists("temp/"):
    os.makedirs("temp/")


class Config:
    SECRET_KEY = (
        os.environ.get("SECRET_KEY")
        or "207f8bb92f0dca5e50bb4929bce85865223bd6e64c1a003a134edc5c47e4d99e"
    )
    ADMIN = os.environ.get("ADMIN") or "Administrator"

    STORAGE_BUCKET = os.environ.get("STORAGE_BUCKET") or "tat-business.appspot.com"

    # max size of files uploaded to database is 5MB
    MAX_CONTENT_LENGTH = os.environ.get("MAX_CONTENT_LENGTH") or 5 * 1024 * 1024

    TASK_PER_PAGE = os.environ.get("TASK_PER_PAGE") or 5

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    MONGODB_SETTINGS = [
        {
            "db": "tatbusiness",
            "host": "localhost",
            "port": 27017,
            "alias": "default",
        }
    ]


class ProductionConfig(Config):
    MONGODB_SETTINGS = [
        {
            "db": os.environ.get("db"),
            "host": os.environ.get("host"),
            "port": os.environ.get("alias") or 27017,
            "alias": os.environ.get("alias") or "default",
            "username": os.environ.get("username"),
            "password": os.environ.get("password"),
        }
    ]


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
