from . import department
from flask import jsonify, current_app, render_template, request, abort
from ..decorators import login_required
from requests import post, put, get
from ..models import Role, Permission


@department.before_request
@login_required()
def admin_required(payload):
    role = None
    if len(Role.role_list) < 1:
        Role.get_roles_data()

    for r in Role.role_list:
        if r == payload.get("role_id"):
            role = r
            break

    if role is None:
        abort(403)

    if Role.role_list[role].has_permission(Permission.MODIFY_DEPARTMENT) != True:
        abort(403)


@department.route("/", methods=["GET"])
@login_required()
def index(payload):
    # Request Task Home page
    if request.args.get("api") is None:
        return render_template("components/department/department.html", user=payload)

    resp = get(
        current_app.config["DEPARTMENT_SERVICE"] + "/department/get-all-departments",
        cookies=request.cookies,
    )

    data = resp.json()
    return jsonify(data)


@department.route("/<id>", methods=["GET"])
@login_required()
def detail(payload, id):
    resp = get(
        current_app.config["DEPARTMENT_SERVICE"]
        + "/department/get-department-detail?department_id="
        + id,
        cookies=request.cookies,
    )

    users_resp = get(
        current_app.config["USER_SERVICE"] + "/user-admin/get-all-users",
        cookies=request.cookies,
    )

    users_data = users_resp.json()
    if users_data.get("status") == False:
        abort(404)

    employees = users_data.get("data")

    try:
        department = resp.json().get("data")
        department_users = []
        for employee in employees:
            if employee.get("user_id") == department.get("leader_id"):
                department["leader"] = employee
            elif employee.get("department_id") == department.get("department_id"):
                department_users.append(employee)

        department["employees"] = department_users
    except:
        abort(404)
    return render_template(
        "components/department/department-detail.html",
        user=payload,
        department=department,
    )


# Update Department
@department.route("/update-department", methods=["PUT"])
@login_required()
def update_department(payload):

    # call service request reset password
    if request.content_type != "application/json":
        return jsonify(status=False, message="API chỉ hỗ trợ application/json")

    resp = put(
        current_app.config["DEPARTMENT_SERVICE"] + "/department/update-department",
        json=request.json,
        cookies=request.cookies,
    )

    try:
        data = resp.json()
    except:
        return jsonify(status=False, message="Something went wrong")

    return jsonify(data)


# Update Department
@department.route("/appoint-leader", methods=["PUT"])
@login_required()
def appoint_leader(payload):

    # call service request reset password
    if request.content_type != "application/json":
        return jsonify(status=False, message="API chỉ hỗ trợ application/json")

    print(request.json.get("action"))

    if request.json.get("action") == "assign":
        resp = put(
            current_app.config["DEPARTMENT_SERVICE"]
            + "/department/assign-leader-department",
            json=request.json,
            cookies=request.cookies,
        )

    if request.json.get("action") == "replace":
        resp = put(
            current_app.config["DEPARTMENT_SERVICE"]
            + "/department/change-leader-department",
            json=request.json,
            cookies=request.cookies,
        )

    try:
        data = resp.json()
    except:
        return jsonify(status=False, message="Something went wrong")

    return jsonify(data)


# Add user
@department.route("/add", methods=["GET", "POST"])
@login_required()
def add_user(payload):
    if request.method == "GET":
        return render_template("components/department/add-department.html")

    # ADD Department service
    resp = post(
        current_app.config["DEPARTMENT_SERVICE"] + "/department/create-department",
        cookies=request.cookies,
        json=request.json,
    )
    data = resp.json()
    return jsonify(data)
