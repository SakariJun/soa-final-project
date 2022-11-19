from . import users
from flask import make_response, jsonify, current_app, render_template, request, abort
from ..decorators import login_required
from requests import post, put, get


@users.route("/", methods=["GET"])
@login_required
def index(payload):

    resp = get(current_app.config["TASK_SERVICE"] + "/api/users/me", cookies=request.cookies)
    data = resp.json()
    print(data)
    if data.get("status") == False:
        abort(404)

    data = data.get("data")
    return render_template(
        "components/users.html",
        users=data.get("tasks"),
        max_pages=data.get("max_pages"),
        current_page=data.get("current_page"),
        user=payload
    )


# Add user
@users.route("/add", methods=["GET", "POST"])
@login_required
def add_user(payload):
    if request.method == "GET":
        return render_template('components/add-user.html')


@users.route("/submit-task/<id>", methods=["PUT"])
@login_required
def submit_task(payload, id):
    pass
