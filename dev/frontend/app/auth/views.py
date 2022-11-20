from . import auth
from flask import make_response, jsonify, current_app, render_template, request, abort
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
    if resp.json().get("status") == True:
        response.set_cookie("accessToken", resp.cookies.get("accessToken"))
    return response


@auth.route("/activate", methods=["GET"])
@auth.route("/change-password", methods=["GET", "POST"])
@login_required(activate=False)
def change_password(payload):
    if request.method != "POST":
        if payload.get("is_activate") == True:
            return render_template("components/auth/change-password.html", user=payload)
        return render_template("components/auth/activate.html", user=payload)

    # call service update password
    if request.content_type != "application/json":
        return jsonify(status=False, message="API chỉ hỗ trợ application/json")

    if payload.get("is_activate") == True:
        redirect = '/auth/logout'
        resp = put(
            current_app.config["USER_SERVICE"] + "/user/change-password-optional",
            cookies=request.cookies,
            json=request.json,
        )
    else:
        redirect = '/'
        resp = put(
            current_app.config["USER_SERVICE"] + "/user/change-password-require",
            cookies=request.cookies,
            json=request.json,
        )

    data = resp.json()
    return jsonify(data, redirect=redirect)


@auth.route("/logout", methods=["GET", "POST"])
@login_required(activate=False)
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


@auth.route("/profile", methods=["GET"])
@login_required()
def profile(payload):

    resp = get(
        current_app.config["USER_SERVICE"] + "/user/get-user-information",
        cookies=request.cookies,
    )
    data = resp.json()
    if resp.json().get("status") != True:
        abort(404)
    user = data.get("data")
    resp.close()
    return render_template("components/auth/profile.html", user=user)


@auth.route("/change-avatar", methods=["PUT"])
@login_required()
def change_avatar(payload):

    if request.files.get("avatar") is not None:
        file = request.files.get("avatar")
        avatar = {"avatar": (file.filename, file, file.mimetype)}
        resp = put(
            current_app.config["USER_SERVICE"] + "/user/change-user-avatar",
            cookies=request.cookies,
            files=avatar,
        )
        data = resp.json()
        print(data)
        resp.close()
        return jsonify(data)
