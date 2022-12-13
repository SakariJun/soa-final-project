from flask import jsonify, current_app
from . import main


@main.app_errorhandler(403)
def forbidden(e):
    return jsonify(status=False, message=str(e)), 403


@main.app_errorhandler(404)
def page_not_found(e):
    return jsonify(status=False, message=str(e)), 404


@main.app_errorhandler(413)
def entity_too_large(e):
    return (
        jsonify(
            status=False,
            message="File quá lớn. Vui lòng chọn file nhỏ hơn %s MB"
            % (current_app.config["MAX_CONTENT_LENGTH"] / 1024 / 1024),
        ),
        404,
    )


@main.app_errorhandler(500)
def internal_server_error(e):
    return jsonify(status=False, message=str(e)), 500
