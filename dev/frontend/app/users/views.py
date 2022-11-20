from . import users
from flask import make_response, jsonify, current_app, render_template, request, abort
from ..decorators import login_required
from requests import post, put, get


# Danh sách users - account
@users.route("/", methods=["GET"])
@login_required
def index(payload):

    resp = get(
        current_app.config["USER_SERVICE"] + "/user-admin/get-all-users", cookies=request.cookies
    )
    data = resp.json()
    if data.get("status") == False:
        abort(403)

    data = data.get("data")
    return render_template(
        "components/users/users.html",
        employees=data,
        user=payload,
    )

# Danh sách thông tin lương thưởng
@users.route("/salary", methods=["GET"])
@login_required
def users_salary(payload):
    resp = get(
        current_app.config["USER_SERVICE"] + "/user-admin/get-all-users", cookies=request.cookies
    )
    data = resp.json()
    if data.get("status") == False:
        abort(403)

    data = data.get("data")
    return render_template(
        "components/users/users-salary.html",
        employees=data,
        user=payload,
    )

# Add user
@users.route("/add", methods=["GET", "POST"])
@login_required
def add_user(payload):
    if request.method == "GET":
        resp = get(
            current_app.config["DEPARTMENT_SERVICE"]
            + "/department/get-all-departments",
            cookies=request.cookies,
        )
        data = resp.json()
        if data.get("status") == False:
            abort(403)
        departments = data.get("data")
        return render_template("components/users/add-user.html", departments=departments)

    # ADD USER service
    resp = post(
        current_app.config["USER_SERVICE"] + "/user-admin/add-user",
        cookies=request.cookies,
        json=request.json,
    )
    data = resp.json()
    if data.get('status')==True:
        return jsonify(status=True, message="Thêm nhân viên thành công. Mã nhân viên là: %s\n Tài khoản = Mật khẩu là Mã số nhân viên" %(data.get('data')[0].get('user_id')))
    return jsonify(data)


@users.route("/submit-task/<id>", methods=["PUT"])
@login_required
def submit_task(payload, id):
    pass
