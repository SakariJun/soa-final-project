from . import tasks
from flask import jsonify, current_app, render_template, request, abort
from ..decorators import login_required
from requests import post, put, get
from ..utils import get_request_data
from ..models import Role, Permission
from multiprocessing import Pool
from datetime import datetime
from bson.objectid import ObjectId


@tasks.before_request
@login_required()
def before_request(payload):
    if len(Role.role_list) < 1:
        Role.get_roles_data()

    if (
        Role.role_list.get(payload.get("role_id")).has_permission(Permission.READ_TASK)
        == False
    ):
        abort(403)


# Get list of tasks of user
@tasks.route("/", methods=["GET"])
@tasks.route("/<int:page>", methods=["GET"])
@login_required()
def index(payload, page=1):
    # Get thông tin tasks
    employees = []
    manager = None

    if page < 1:
        page = 1

    # Get thông tin user if user có quyền tạo task
    role = None
    for r in Role.role_list:
        if r == payload.get("role_id"):
            role = r
            break

    if role is None:
        abort(404)

    if Role.role_list[role].has_permission(Permission.MODIFY_TASK):
        with Pool() as pool:
            resp = pool.starmap(
                get_request_data,
                [
                    (
                        current_app.config["TASK_SERVICE"]
                        + "/api/tasks/me/"
                        + str(page),
                        request.cookies,
                    ),
                    (
                        current_app.config["USER_SERVICE"]
                        + "/user/get-all-user-by-leader",
                        request.cookies,
                    ),
                ],
            )
            pool.close()
            pool.join()
            task_data = resp[0]
            employees = resp[1]
    else:
        with Pool() as pool:
            resp = pool.starmap(
                get_request_data,
                [
                    (
                        current_app.config["TASK_SERVICE"]
                        + "/api/tasks/me/"
                        + str(page),
                        request.cookies,
                    ),
                    (
                        current_app.config["USER_SERVICE"]
                        + "/user/get-user-information",
                        request.cookies,
                    ),
                ],
            )
            pool.close()
            pool.join()
            task_data = resp[0]
            manager = resp[1].get("leader", {})

    tasks = task_data.get("tasks")
    max_pages = task_data.get("max_pages")
    current_page = task_data.get("current_page")

    if manager is None or len(manager) < 1:
        manager = payload

    # map user id to officer id
    for task in tasks:
        if len(employees) < 1:
            task["officer"] = payload
            break
        for employee in employees:
            if employee.get("user_id") == task.get("officer_id"):
                task["officer"] = employee
                break

    return render_template(
        "components/tasks.html",
        tasks=tasks,
        max_pages=max_pages,
        current_page=current_page,
        user=payload,
        employees=employees,
        manager=manager,
    )


@tasks.route("/task/<id>", methods=["GET"])
@login_required()
def get_task(payload, id):
    resp = get(
        current_app.config["TASK_SERVICE"] + "/api/task/" + id,
        cookies=request.cookies,
    )

    data = resp.json()
    resp.close()
    if data.get("status") == False:
        return jsonify(data)

    data["data"]["created_at"] = datetime.strftime(
        ObjectId(data["data"]["_id"]).generation_time, "%Y-%m-%d"
    )

    data["data"]["updated_at"] = datetime.strftime(
        datetime.strptime(data["data"]["updated_at"], "%a, %d %b %Y %H:%M:%S GMT"),
        "%Y-%m-%d",
    )
    data["data"]["deadline"] = datetime.strftime(
        datetime.strptime(data["data"]["deadline"], "%a, %d %b %Y %H:%M:%S GMT"),
        "%Y-%m-%d",
    )
    return jsonify(data)


@tasks.route("/create-task", methods=["POST"])
@login_required()
def create_task(payload):

    if len(Role.role_list) < 1:
        Role.get_roles_data()

    if (
        Role.role_list.get(payload.get("role_id")).has_permission(
            Permission.MODIFY_TASK
        )
        == False
    ):
        return jsonify(status=False, message="Bạn không có quyền sử dụng chức năng này")

    files = []
    if request.files.get("files") is not None:
        for file in request.files.getlist("files"):
            file = ("files", (file.filename, file, file.mimetype))
            files.append(file)

    resp = post(
        current_app.config["TASK_SERVICE"] + "/api/create-task",
        data=request.form,
        files=files,
        cookies=request.cookies,
    )
    data = resp.json()
    resp.close()
    return jsonify(data)


@tasks.route("/cancel-task", methods=["PUT"])
@login_required()
def cancel_task(payload):
    if len(Role.role_list) < 1:
        Role.get_roles_data()

    if (
        Role.role_list.get(payload.get("role_id")).has_permission(
            Permission.MODIFY_TASK
        )
        == False
    ):
        return jsonify(status=False, message="Bạn không có quyền sử dụng chức năng này")

    if request.content_type != "application/json":
        return jsonify(status=False, message="API chỉ hỗ trợ json")

    data = request.json
    resp = put(
        current_app.config["TASK_SERVICE"]
        + "/api/cancel-task/"
        + data.get("task_id", ""),
        cookies=request.cookies,
    )
    data = resp.json()
    resp.close()
    return jsonify(data)


@tasks.route("/accept-task", methods=["PUT"])
@login_required()
def accept_task(payload):
    if request.content_type != "application/json":
        return jsonify(status=False, message="API chỉ hỗ trợ json")

    data = request.json
    resp = put(
        current_app.config["TASK_SERVICE"]
        + "/api/accept-task/"
        + data.get("task_id", ""),
        cookies=request.cookies,
    )
    data = resp.json()
    resp.close()
    return jsonify(data)


@tasks.route("/submit-task/<id>", methods=["PUT"])
@login_required()
def submit_task(payload, id):
    data = {}
    for key in request.form:
        data[key] = request.form.get(key)

    files = []
    if request.files.get("files") is not None:
        for file in request.files.getlist("files"):
            file = ("files", (file.filename, file, file.mimetype))
            files.append(file)

    resp = put(
        current_app.config["TASK_SERVICE"] + "/api/submit-task/" + id,
        files=files,
        data=data,
        cookies=request.cookies,
    )
    data = resp.json()
    resp.close()
    return jsonify(data)


@tasks.route("/reject-task/<id>", methods=["PUT"])
@login_required()
def reject_task(payload, id):
    data = {}
    for key in request.form:
        data[key] = request.form.get(key)

    files = []
    if request.files.get("files") is not None:
        for file in request.files.getlist("files"):
            file = ("files", (file.filename, file, file.mimetype))
            files.append(file)

    resp = put(
        current_app.config["TASK_SERVICE"] + "/api/reject-task/" + id,
        files=files,
        data=data,
        cookies=request.cookies,
    )
    data = resp.json()
    resp.close()
    return jsonify(data)


# Approve task
@tasks.route("/approve-task", methods=["PUT"])
@login_required()
def approve_task(payload):
    if request.content_type != "application/json":
        return jsonify(status=False, message="API chỉ hỗ trợ json")

    data = request.json
    resp = put(
        current_app.config["TASK_SERVICE"]
        + "/api/approve-task/"
        + data.get("task_id", ""),
        cookies=request.cookies,
        json=request.json,
    )

    data = resp.json()
    resp.close()
    return jsonify(data)
