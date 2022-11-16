from flask import (abort, request, current_app, jsonify, send_file, Response)
from flask_cors import cross_origin
from . import api
from ..documents import TaskConversation, Task, TaskStatus
from datetime import datetime, timedelta
from ..utils.validator import validate_task_data
from firebase_admin import storage
import os
from io import BytesIO


# API get constraint of Task
# - get all task status
@api.route("/task-status/", methods=["GET"])
def task_status_all():
    return jsonify(status=True, data=TaskStatus.objects.all()), 200


# - get task status by status id
@api.route("/task-status/<int:id>", methods=["GET"])
def task_status(id):
    try:
        task_status = TaskStatus.objects(id=id).get()
    except TaskStatus.DoesNotExist:
        return jsonify(status=False,
                       message="Không tìm thấy Trạng thái id = %s" % id), 400
    return jsonify(status=True, data=task_status.status), 200


# API for create a new task
# body -> form data: {
#     officer_id -> str
#     title -> str
#     description -> str
#     deadline -> datetime
#     files -> list attachements
# }
@api.route("/create-task", methods=["POST"])
def create_task():
    data = request.form
    data = validate_task_data(data)

    if data.get('status') == False:
        return jsonify(data), 400

    bucket = storage.bucket()
    data = data.get('data')

    # NOTE: Chưa xử lý check đăng nhập -> lấy user_id
    task = Task(
        manager_id=str(1),
        officer_id=data.get('officer_id'),
        title=data.get('title', ""),
        description=data.get('description', ""),
        deadline=data.get('deadline', datetime.now()),
    )
    task.save()

    # Trường hợp upload file > MAX_CONTENT_LENGTH
    # Hệ thống quăng error 413 -> Đã handle error
    try:
        for file in request.files.getlist('files'):
            file_path = 'tasks/%s/%s' % (str(task.id), (file.filename))
            file.save('temp/%s' % file.filename)
            blob = bucket.blob(file_path)
            blob.upload_from_filename('temp/%s' % file.filename)
            os.remove('temp/%s' % file.filename)
    except Exception as e:
        for f in os.listdir('temp'):
            os.remove(os.path.join('temp', f))
        task.delete()
        print(str(e))
        return jsonify(
            status=False,
            message=
            'Đã có lỗi xảy ra trong quá trình upload file. Vui lòng liên hệ Admin để kiểm tra hệ thống'
        ), 400

    return jsonify(status=True, message="Tạo công việc mới thành công."), 200


# API for getting all task by manager or employee
@api.route("/tasks/me/", methods=["GET"])
@api.route("/tasks/me/<int:page>/", methods=["GET"])
def get_all_tasks(page=1):
    # data = request.json
    # NOTE: Chưa xử lý check đăng nhập

    if page < 1:
        abort(404)

    # Paginate
    tasks_pagination = Task.objects(officer_id="4").paginate(
        page=page, per_page=current_app.config['TASK_PER_PAGE'] or 10)

    current_page = tasks_pagination.page
    max_pages = tasks_pagination.pages
    tasks = tasks_pagination.items
    map_tasks = []

    for task in tasks:
        urls = []
        files = storage.bucket().list_blobs(prefix='tasks/%s' % str(task.id))
        for file in files:
            urls.append(
                dict(filename=file.name[file.name.rindex('/') + 1:],
                     url=file.generate_signed_url(datetime.today() +
                                                  timedelta(days=1))))

        task = task.to_mongo().to_dict()
        task['_id'] = str(task['_id'])
        task['files'] = urls
        map_tasks.append(task)

    return jsonify(status=True, data=map_tasks)


# API for download files
# Parameters:
# id - task id
# name - file name which is requested to download
# @api.route("/tasks/<id>/attachment/<name>/")
# def download_file(id, name):
#     return "hello"
#     # data = request.json
#     task = Task.objects(id=id).first()
#     Response.headers.add('Access-Control-Allow-Origin', '*')
#     file = storage.bucket().blob('tasks/%s/%s' % (str(task.id), name))

#     return send_file(BytesIO(file.download_as_bytes()),
#                      mimetype=file.content_type)


@api.route("/accept-task", methods=["PUT"])
def accept_task():
    task = Task.objects(id="637296ce7ed7ad582dc6a504").get()
    conv = TaskConversation(user_id=str(3), content="hello haha ha")
    task.conversations.append(conv)
    task.save()
    return "hello world"


@api.route("/submit-task", methods=["POST"])
def submit_task():
    task = Task.objects.first()
    return str(task.to_json())
