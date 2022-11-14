import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'The string that nobody knows'
    
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.googlemail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', '587'))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in \
        ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get(
        'MAIL_USERNAME') or "thinhtruong04012001@gmail.com"
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or "ggasrnxqxqrwntuz"
    
    FLASKY_MAIL_SUBJECT_PREFIX = '[Flasky]'
    FLASKY_MAIL_SENDER = 'Flasky Admin <flasky@example.com>'
    FLASKY_ADMIN = os.environ.get('FLASKY_ADMIN')

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    FLASKY_USERS_PER_PAGE = 15
    FLASKY_POSTS_PER_PAGE = 20
    FLASKY_FOLLOWERS_PER_PAGE = 50
    FLASKY_COMMENTS_PER_PAGE = 30

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    MONGOALCHEMY_CONNECTION_STRING = os.environ.get('DEV_DATABASE_URL') or \
       'mongodb://localhost:27017'
    MONGOALCHEMY_DATABASE = "tatbusiness"

class ProductionConfig(Config):
    MONGOALCHEMY_CONNECTION_STRING = os.environ.get('DATABASE_URL') or \
        'mongodb://localhost:27017'
    MONGOALCHEMY_DATABASE = "tatbusiness"


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
