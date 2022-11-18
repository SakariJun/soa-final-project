import os
from flask import (
    session,
    redirect,
    url_for,
    request,
    abort,
    render_template,
    Response,
    jsonify,
)
from . import main
from ..decorators import token_required

# Check request first time or load components
@main.before_app_request
def before_app_request():
    load = request.args.get("load", False)
    # first time load page -> load base.html
    # -> load js, css, etc
    if 'static' not in request.path and load == False:
        return render_template("base.html", role_id="6375a605f912fa4857d6f488")


@main.route("/")
def index():
    # Request Task Home page
    return render_template("index.html", role_id="6375a605f912fa4857d6f488")