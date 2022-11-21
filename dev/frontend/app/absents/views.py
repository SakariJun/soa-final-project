from flask import (
    render_template,
)
from . import absents
from ..decorators import login_required


@absents.route("/", methods=["GET"])
@login_required()
def index(payload):
    # Request Task Home page
    return "<h3 class='text-center'>Chức năng sẽ sớm cập nhật <3.</h3>"

@absents.route("/me", methods=["GET"])
@login_required()
def user_absents(payload):
    # Request Task Home page
    return "<h3 class='text-center'>Chức năng sẽ sớm cập nhật <3.</h3>"