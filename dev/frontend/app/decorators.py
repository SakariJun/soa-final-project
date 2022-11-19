from jwt import decode
from flask import request, jsonify, abort, current_app, redirect, flash
from functools import wraps
from datetime import datetime


def not_login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        # jwt is passed in the request header
        # token = request.headers.get("Cookie")
        cookies = request.cookies
        if "accessToken" in cookies:
            accessToken = cookies.get("accessToken", "")
            try:
                payload = decode(
                    accessToken,
                    key=current_app.config["SECRET_KEY"],
                    algorithms=["HS256"],
                )

                # accessToken is expired
                if datetime.now().timestamp() > payload.get("exp", 0):
                    pass
                return jsonify(status=False, redirect="/"), 303
            except Exception as e:
                pass

        return f(*args, **kwargs)

    return decorated


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        # jwt is passed in the request header
        # token = request.headers.get("Cookie")
        cookies = request.cookies

        if cookies is None:
            return (
                jsonify(
                    status=False,
                    message="Vui lòng đăng nhập để tiếp tục",
                    redirect="/auth/login",
                ),
                303,
            )

        # token = token.split("=")

        if "accessToken" not in cookies:
            return (
                jsonify(
                    status=False,
                    message="Vui lòng đăng nhập để tiếp tục",
                    redirect="/auth/login",
                ),
                303,
            )

        # accessToken = cookies[cookies.index("accessToken") + 1]
        accessToken = cookies.get("accessToken", "")
        try:
            payload = decode(
                accessToken, key=current_app.config["SECRET_KEY"], algorithms=["HS256"]
            )

            # accessToken is expired
            if datetime.now().timestamp() > payload.get("exp", 0):
                return jsonify(
                    status=False,
                    message="Phiên đăng nhập đã hết hạn",
                    redirect="/auth/login",
                )
        except Exception as e:
            print(str(e))
            return (
                jsonify(
                    status=False,
                    message="Vui lòng đăng nhập lại",
                    redirect="/auth/login",
                ),
                400,
            )

        return f(payload, *args, **kwargs)

    return decorated
