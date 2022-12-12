from flask import render_template, current_app, request, abort, json, jsonify
from . import absents
from ..decorators import login_required
from requests import get, put, post
from ..utils import get_request_data
from multiprocessing import Pool


@absents.route("/", methods=["GET"])
@login_required()
def index(payload):
    # Request Task Home page
    resp = get(
        current_app.config["ABSENCE_SERVICE"]
        + "/absence-request/get-all-absence-request-by-manager",
        cookies=request.cookies,
    )
    data = resp.json()
    if resp.status_code != 200:
        abort(resp.status_code)

    absents = data.get("data")

    return render_template(
        "components/absent/absent-requests.html", absents=json.dumps(absents)
    )


@absents.route("/me", methods=["GET"])
@login_required()
def user_absents(payload):

    with Pool() as pool:
        resp = pool.starmap(
            get_request_data,
            [
                (
                    current_app.config["ABSENCE_SERVICE"]
                    + "/absence-request/get-all-absence-request-by-employee",
                    request.cookies,
                ),
                (
                    current_app.config["ABSENCE_SERVICE"]
                    + "/absence/get-absence-information",
                    request.cookies,
                ),
            ],
        )

        pool.close()
        pool.join()
        absents = resp[0]
        employeeAbsenceDetail = resp[1]

    return render_template(
        "components/absent/absent-list.html",
        absents=json.dumps(absents),
        employeeAbsenceDetail=json.dumps(employeeAbsenceDetail),
    )


@absents.route("/absent/<id>", methods=["GET"])
@login_required()
def absent(payload, id):
    # Request Task Home page
    resp = get(
        current_app.config["ABSENCE_SERVICE"]
        + "/absence-request/get-absence-request-detail?absence_request_id="
        + id,
        cookies=request.cookies,
    )
    data = resp.json()
    if resp.status_code != 200:
        abort(resp.status_code)

    absent = data.get("data")

    if absent.get("user_id") == payload.get("user_id"):
        return render_template(
            "components/absent/absent.html", absent=json.dumps(absent)
        )

    return render_template(
        "components/absent/absent-review.html", absent=json.dumps(absent)
    )


# Yêu cầu nghỉ phép
@absents.route("/absence-request", methods=["POST"])
@login_required()
def request_absence(payload):
    files = []
    if request.files.get("absence_request_files") is not None:
        for file in request.files.getlist("absence_request_files"):
            file = ("absence_request_files", (file.filename, file, file.mimetype))
            files.append(file)

    resp = post(
        current_app.config["ABSENCE_SERVICE"]
        + "/absence-request/create-absence-request",
        cookies=request.cookies,
        data=request.form,
        files=files,
    )

    data = resp.json()
    resp.close()
    return jsonify(data)


# Yêu cầu nghỉ phép
@absents.route("/approve", methods=["PUT"])
@absents.route("/refuse", methods=["PUT"])
@login_required()
def approve_absence(payload):
    resp = put(
        current_app.config["ABSENCE_SERVICE"]
        + "/absence-request/update-absence-request-state",
        cookies=request.cookies,
        json=request.json,
    )

    data = resp.json()
    resp.close()
    return jsonify(data)
