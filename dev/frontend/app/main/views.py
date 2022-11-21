from flask import (
    current_app,
    request,
    render_template,
)
from . import main
from ..decorators import login_required
from jwt import decode
from multiprocessing import Pool
from ..utils import get_request_data

# Check request first time or load components
@main.before_app_request
def before_app_request():
    if request.method == "GET" and request.args.get("api") is None:
        load = request.args.get("load", False)
        # first time load page -> load base.html
        # -> load js, css, etc
        if "static" not in request.path and load == False:
            # user_response = get(current_app.config['USER_SERVICE'] + "/user/get-user-information")
            # print(user_response.json)
            if "accessToken" in request.cookies:
                try:
                    payload = decode(
                        request.cookies.get("accessToken", ""),
                        key=current_app.config["SECRET_KEY"],
                        algorithms=["HS256"],
                    )
                    return render_template("base.html", user=payload)
                except Exception as e:
                    return render_template("base.html", user="")
            return render_template("base.html", user="")


@main.route("/", methods=["GET"])
@login_required()
def index(payload):
    # Request Task Home page
    with Pool() as pool:
        resp = pool.starmap(
            get_request_data,
            [
                # Tasks
                (
                    current_app.config["TASK_SERVICE"] + "/api/tasks/statistic/",
                    request.cookies,
                ),
                # Nhân viên cùng phòng
                (
                    current_app.config["USER_SERVICE"]
                    + "/user/count-all-users-by-department-id?department_id="
                    + str(payload.get("department_id") or "1"),
                    request.cookies,
                ),
                # tổng nhân viên cty
                (
                    current_app.config["USER_SERVICE"] + "/user/count-all-users",
                    request.cookies,
                ),
                # thông tin cá nhân
                (
                    current_app.config["USER_SERVICE"] + "/user/get-user-information",
                    request.cookies,
                ),
            ],
        )

        pool.close()
        pool.join()
        task_data = resp[0]
        co_workers = resp[1]
        employees = resp[2]
        user = resp[3]

    total = 0
    completed = 0
    for task_user in task_data:
        total += task_data.get(task_user).get("Total", 0)
        completed += task_data.get(task_user).get("Completed", 0)

    return render_template(
        "index.html",
        user=user,
        co_workers=co_workers,
        employees=employees,
        tasks=task_data,
        total=total,
        completed=completed,
    )


# Just use to load header after login
@main.route("/header", methods=["GET"])
@login_required()
def header(payload):
    return render_template("components/header.html", user=payload)
