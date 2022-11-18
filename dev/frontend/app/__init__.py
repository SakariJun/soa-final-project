from flask import Flask
from config import config
from flask_moment import Moment
from datetime import datetime

moment = Moment()


def create_app(config_name):
    global app
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    global db

    moment.init_app(app)

    if config_name == "production":
        import logging
        # Logs theo ngày
        logging.basicConfig(
            filename="logs/%s.log" % (datetime.now().date()),
            level=logging.DEBUG,
            format="%(asctime)s %(levelname)s %(name)s %(message)s",
        )
        logger = logging.getLogger(__name__)

    from .main import main as main_blueprint

    app.register_blueprint(main_blueprint, url_prefix="/")

    from .auth import auth as auth_blueprint

    app.register_blueprint(auth_blueprint, url_prefix="/auth")

    from .admin import admin as admin_blueprint

    app.register_blueprint(admin_blueprint, url_prefix="/admin")

    return app