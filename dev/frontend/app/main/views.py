import os
from flask import (
    current_app,
    redirect,
    url_for,
    request,
    abort,
    render_template,
    Response,
    jsonify,
)
from requests import get, post, put
from . import main
from ..decorators import token_required

# Check request first time or load components
@main.before_app_request
def before_app_request():
    load = request.args.get("load", False)
    # first time load page -> load base.html
    # -> load js, css, etc
    if "static" not in request.path and load == False:
        # user_response = get(current_app.config['USER_SERVICE'] + "/user/get-user-information")
        # print(user_response.json)
        return render_template("base.html", user="")


@main.route("/")
@token_required
def index(payload):
    # Request Task Home page
    return render_template("index.html")
