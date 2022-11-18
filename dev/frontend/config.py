import os

basedir = os.path.abspath(os.path.dirname(__file__))
if not os.path.exists("logs/"):
    os.makedirs("logs/")


class Config:
    SECRET_KEY = (
        os.environ.get("SECRET_KEY")
        or "207f8bb92f0dca5e50bb4929bce85865223bd6e64c1a003a134edc5c47e4d99e"
    )

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    pass


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
