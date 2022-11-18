from config import config
from flask import Flask
from flask_cors import CORS
from flask_mongoengine import MongoEngine

# Firebase storage
import firebase_admin
from firebase_admin import credentials
from datetime import datetime

mail = Mail()
db = MongoEngine()
cors = CORS()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    db.init_app(app)
    cors.init_app(app)

    if config_name == "production":
        import logging

        logging.basicConfig(
            filename="logs/%s.log" % (datetime.now().date()),
            level=logging.DEBUG,
            format="%(asctime)s %(levelname)s %(name)s %(message)s",
        )
        logger = logging.getLogger(__name__)

    cred = credentials.Certificate(
        "tat-business-firebase-adminsdk-d4cif-1c16ce3446.json"
    )

    firebase_admin.initialize_app(cred, {"storageBucket": app.config["STORAGE_BUCKET"]})

    from .main import main as main_blueprint

    app.register_blueprint(main_blueprint)

    from .api import api as api_blueprint

    app.register_blueprint(api_blueprint, url_prefix="/api")

    return app
