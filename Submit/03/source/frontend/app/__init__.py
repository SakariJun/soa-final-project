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

    from .tasks import tasks as tasks_blueprint

    app.register_blueprint(tasks_blueprint, url_prefix="/tasks")

    from .users import users as users_blueprint

    app.register_blueprint(users_blueprint, url_prefix="/users")

    from .department import department as department_blueprint

    app.register_blueprint(department_blueprint, url_prefix="/departments")

    from .absents import absents as absents_blueprint

    app.register_blueprint(absents_blueprint, url_prefix="/absents")

    return app
