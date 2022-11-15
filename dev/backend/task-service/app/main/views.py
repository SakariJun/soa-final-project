from flask import (
    render_template,
    redirect,
    url_for,
    abort,
    flash,
    request,
    current_app,
    make_response,
)
from . import main


@main.route("/", methods=["GET"])
def index():
    return "hello world"
