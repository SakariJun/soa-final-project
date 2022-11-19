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
from ..decorators import login_required, not_login_required
from jwt import decode

# Check request first time or load components
@main.before_app_request
def before_app_request():
    if request.method == "GET":
        load = request.args.get("load", False)
        # first time load page -> load base.html
        # -> load js, css, etc
        if "static" not in request.path and load == False:
            # user_response = get(current_app.config['USER_SERVICE'] + "/user/get-user-information")
            # print(user_response.json)
            if "accessToken" in request.cookies:
                try:
                    payload = decode(
                        request.cookies.get("accessToken", ""), key=current_app.config["SECRET_KEY"], algorithms=["HS256"]
                    )
                    return render_template("base.html", user=payload)
                except Exception as e:
                    return render_template("base.html", user="")
            return render_template("base.html", user="")


@main.route("/")
@login_required
def index(payload):
    # Request Task Home page
    return render_template("index.html", user=payload)


# Just use to load header after login
@main.route("/header", methods=["GET"])
@login_required
def header(payload):
    print(payload)
    return render_template("components/header.html", user=payload)