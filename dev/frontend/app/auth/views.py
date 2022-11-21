from . import auth
from flask import make_response, jsonify, current_app, render_template, request, abort
from ..decorators import login_required, not_login_required
from requests import post, put, get
from datetime import datetime
from jwt import encode


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
        redirect = "/auth/logout"
        resp = put(
            current_app.config["USER_SERVICE"] + "/user/change-password-optional",
            cookies=request.cookies,
            json=request.json,
        )
    else:
        redirect = "/"
        resp = put(
            current_app.config["USER_SERVICE"] + "/user/change-password-require",
            cookies=request.cookies,
            json=request.json,
        )

    try:
        data = resp.json()
        data["redirect"] = redirect

        response = make_response(jsonify(data))

        if payload.get("is_activate") != True and data.get("status") == True:
            payload["is_activate"] = True
            token = encode(payload, key=current_app.config.get("SECRET_KEY"))
            response.set_cookie("accessToken", token)

        resp.close()
        return response
    except:
        abort(404)


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
    user["day_of_birth"] = datetime.strftime(
        datetime.strptime(user["day_of_birth"], "%Y-%m-%dT%H:%M:%S.%fZ"),
        "%Y-%m-%d",
    )
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
        resp.close()
        return jsonify(data)


@auth.route("/reset-password", methods=["GET", "POST"])
@not_login_required
def reset_password():
    if request.method != "POST":
        return render_template("components/auth/reset-password.html")

    # call service request reset password
    if request.content_type != "application/json":
        return jsonify(status=False, message="API chỉ hỗ trợ application/json")

    resp = post(
        current_app.config["USER_SERVICE"] + "/user/request-reset-password",
        json=request.json,
    )

    try:
        data = resp.json()
    except:
        abort(404)

    return jsonify(data)


@auth.route("/admin-reset-password", methods=["PUT"])
@login_required()
def admin_reset_password(payload):

    # call service request reset password
    if request.content_type != "application/json":
        return jsonify(status=False, message="API chỉ hỗ trợ application/json")

    resp = post(
        current_app.config["USER_SERVICE"] + "/user-admin/reset-password",
        json=request.json,
        cookies=request.cookies,
    )

    try:
        data = resp.json()
    except:
        return jsonify(status=False, message="Something went wrong")

    return jsonify(data)
