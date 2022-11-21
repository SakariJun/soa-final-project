from flask import Blueprint

absents = Blueprint("absents", __name__)

from . import views
