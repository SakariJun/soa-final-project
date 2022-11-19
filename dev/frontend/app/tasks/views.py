from . import tasks
from flask import make_response, jsonify, current_app, render_template, request, abort
from ..decorators import login_required
from requests import post, put, get
from ..models import Role, Permission


# Get list of tasks of user
@tasks.route("/", methods=["GET"])
@login_required
def index(payload):

    # Get thông tin tasks
    resp = get(
        current_app.config["TASK_SERVICE"] + "/api/tasks/me", cookies=request.cookies
    )
    data = resp.json()
    if data.get("status") == False:
        abort(404)

    data = data.get("data")
    tasks = data.get("tasks")
    max_pages = data.get("max_pages")
    current_page = data.get("current_page")

    resp.close()

    employees = []
    # Get thông tin user if user có quyền tạo task
    for r in Role.role_list:
        if r == payload.get("role_id") and Role.role_list[r].has_permission(
            Permission.MODIFY_TASK
        ):
            resp = get(
                current_app.config["USER_SERVICE"] + "/user/get-all-user-by-leader",
                cookies=request.cookies,
            )
            data = resp.json()
            if data.get("status") == False:
                abort(404)
            employees = data.get("data")

    return render_template(
        "components/tasks.html",
        tasks=tasks,
        max_pages=max_pages,
        current_page=current_page,
        user=payload,
        employees=employees,
    )


@tasks.route("/create-task", methods=["POST"])
@login_required
def create_task(payload):
    if request.method != "POST":
        return render_template(
            "tasks/login.html", username=request.cookies.get("username", "")
        )
    # Request login service
    if request.content_type != "application/json":
        return jsonify(status=False, message="Chỉ hỗ trợ json body")
    resp = post(current_app.config["USER_SERVICE"] + "/user/login", json=request.json)
    response = make_response(jsonify(resp.json()))
    if resp.json().get("status") == True:
        response.set_cookie("accessToken", resp.cookies.get("accessToken"))
    return response


@tasks.route("/submit-task/<id>", methods=["PUT"])
@login_required
def submit_task(payload, id):
    pass
