from config import config
from flask import Flask
from flask_mail import Mail
from flask_mongoalchemy import MongoAlchemy

mail = Mail()
db = MongoAlchemy()

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    mail.init_app(app)
    db.init_app(app)

    from .main import main as main_blueprint

    app.register_blueprint(main_blueprint)

    return app
