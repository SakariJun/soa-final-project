from . import auth
from flask import make_response, jsonify, current_app, render_template, request
from ..decorators import login_required, not_login_required
from requests import post, put, get


@auth.route("/login", methods=["GET", "POST"])
@not_login_required
def login():
    if request.method != "POST":
        return render_template(
            "components/auth/login.html", username=request.cookies.get("username", "")
        )
    # Request login service
    if request.content_type != "application/json":
        return jsonify(status=False, message="Chỉ hỗ trợ json body")
    resp = post(current_app.config["USER_SERVICE"] + "/user/login", json=request.json)
    response = make_response(jsonify(resp.json()))
    if resp.json().get('status') == True:
        response.set_cookie('accessToken', resp.cookies.get('accessToken'))
    return response


@auth.route("/logout", methods=["GET", "POST"])
@login_required
def logout(payload):
    response = make_response(
        jsonify(
            status=True,
            message="Đăng xuất thành công",
            redirect="/auth/login",
        )
    )
    response.set_cookie("accessToken", "", expires=0)
    return response, 303
