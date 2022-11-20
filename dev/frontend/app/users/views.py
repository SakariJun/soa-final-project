from . import users
from flask import make_response, jsonify, current_app, render_template, request, abort
from ..decorators import login_required
from requests import post, put, get
from ..utils import get_request_data
from multiprocessing import Pool

# global filter settings
@users.app_template_filter()
def numberFormat(value):
    return format(int(value), ",d").replace(",", ".")


# Danh sách users - account
@users.route("/", methods=["GET"])
@login_required()
def index(payload):

    resp = get(
        current_app.config["USER_SERVICE"] + "/user-admin/get-all-users",
        cookies=request.cookies,
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
@login_required()
def users_salary(payload):
    with Pool() as pool:
        resp = pool.starmap(
            get_request_data,
            [
                (
                    current_app.config["USER_SERVICE"] + "/user-admin/get-all-users",
                    request.cookies,
                ),
                (
                    current_app.config["TASK_SERVICE"] + "/api/tasks/statistic/",
                    request.cookies,
                ),
            ],
        )
        pool.close()
        pool.join()
        task_data = resp[1]
        employees = resp[0]

    return render_template(
        "components/users/users-salary.html",
        employees=employees,
        user=payload,
        task_data=task_data,
    )


# Add user
@users.route("/add", methods=["GET", "POST"])
@login_required()
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
        return render_template(
            "components/users/add-user.html", departments=departments
        )

    # ADD USER service
    resp = post(
        current_app.config["USER_SERVICE"] + "/user-admin/add-user",
        cookies=request.cookies,
        json=request.json,
    )
    data = resp.json()
    if data.get("status") == True:
        return jsonify(
            status=True,
            message="Thêm nhân viên thành công. Mã nhân viên là: %s\n Tài khoản = Mật khẩu là Mã số nhân viên"
            % (data.get("data")[0].get("user_id")),
        )
    return jsonify(data)


# Update user salary
@users.route("/salary/<user_id>", methods=["PUT"])
@login_required()
def update_salary(payload, user_id):
    salary = request.json.get("salary", 0)
    if salary % 1000 != 0:
        return jsonify(status=False, message="Lương phải là bội số của 1000")
    if salary < 1:
        return jsonify(status=False, message="Lương phải là số nguyên dương")

    resp = put(
        current_app.config["USER_SERVICE"] + "/user-admin/update-user-salary",
        cookies=request.cookies,
        json={"user_id": user_id, "salary": salary},
    )
    data = resp.json()
    return jsonify(data)
