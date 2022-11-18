from . import auth
from flask import make_response, jsonify, current_app
from ..decorators import token_required


@auth.route("/login", methods=["GET", "POST"])
def login():
    # Request login service
    return "login"


@auth.route("/logout", methods=["GET", "POST"])
@token_required
def logout(payload):
    response = make_response(
        jsonify(
            status=True,
            message="Đăng xuất thành công",
            redirect="/auth/login",
        )
    )
    response.set_cookie("accessToken", "", expires=0)
    return response
