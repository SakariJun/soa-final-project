from flask import (abort, request, current_app, jsonify)
from flask_cors import cross_origin
from . import api
from ..documents import Task, TaskStatus, TaskStatusDefined, TaskRate, Rate, TaskConversation
from datetime import datetime, timedelta
from ..utils.validator import validate_task_data, validate_conversation_data, validate_task_rate_data
from firebase_admin import storage
import os
from mongoengine.queryset.visitor import Q


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


# - get all task rates
@api.route("/task-rate/", methods=["GET"])
def task_rate_all():
    return jsonify(status=True, data=TaskRate.objects.all()), 200


# - get task rate by status id
@api.route("/task-rate/<int:id>", methods=["GET"])
def task_rate(id):
    try:
        task_rate = TaskRate.objects(id=id).get()
    except TaskStatus.DoesNotExist:
        return jsonify(status=False,
                       message="Không tìm thấy loại Đánh giá id = %s" %
                       id), 400
    return jsonify(status=True, data=task_rate.rate), 200


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
# response {
#   status
#   task object -> dict
#      urls -> all file urls of the task ( attachments )
# }
@api.route("/tasks/me/", methods=["GET"])
@api.route("/tasks/me/<int:page>/", methods=["GET"])
def get_all_tasks(page=1):
    # data = request.json
    # NOTE: Chưa xử lý check đăng nhập
    user_id = '1'

    if page < 1:
        abort(404)

    # Paginate
    tasks_pagination = Task.objects(
        Q(officer_id=user_id)
        | Q(manager_id=user_id)).order_by("-updated_at").paginate(
            page=page, per_page=current_app.config['TASK_PER_PAGE'] or 10)

    current_page = tasks_pagination.page
    max_pages = tasks_pagination.pages
    tasks = tasks_pagination.items
    map_tasks = []

    for task in tasks:
        urls = []
        # Get file urls for task
        files = storage.bucket().list_blobs(prefix='tasks/%s' % str(task.id))
        for file in files:
            urls.append(
                dict(filename=file.name[file.name.rindex('/') + 1:],
                     url=file.generate_signed_url(datetime.today() +
                                                  timedelta(days=1))))
        # Get file urls for task conversations
        conversations = []
        for conversation in task.conversations:
            conversation_urls = []
            files = storage.bucket().list_blobs(
                prefix='task_conversations/task_id_%s/%s' %
                (str(task.id), str(conversation.id)))
            for file in files:
                file_in_dict = dict(
                    filename=file.name[file.name.rindex('/') + 1:],
                    url=file.generate_signed_url(datetime.today() +
                                                 timedelta(days=1)))

                # Exception for folder
                if file_in_dict["filename"] != '':
                    conversation_urls.append(file_in_dict)

            conversation = conversation.to_mongo().to_dict()
            conversation['_id'] = str(conversation['_id'])
            conversation['files'] = conversation_urls
            conversations.append(conversation)

        task = task.to_mongo().to_dict()
        task['_id'] = str(task['_id'])
        task['files'] = urls
        task['conversations'] = conversations
        map_tasks.append(task)

    return jsonify(status=True,
                   data=dict(tasks=map_tasks,
                             current_page=current_page,
                             max_pages=max_pages))


# API for getting task by id
# response task object -> dict
# urls -> all file urls of the task ( attachments )
@api.route("/task/<id>", methods=["GET"])
def get_task(id):
    # data = request.json
    # NOTE: Chưa xử lý check đăng nhập
    # Xử lý kiểm tra id user cookie tồn tại trong id ng giao/nhận
    user_id = "1"
    try:
        task = Task.objects(id=id).get()
        if task.manager_id != user_id and task.officer_id != user_id:
            return jsonify(status=False,
                           message="Không có quyền truy cập Task này"), 400

        urls = []
        files = storage.bucket().list_blobs(prefix='tasks/%s' % str(task.id))
        for file in files:
            urls.append(
                dict(filename=file.name[file.name.rindex('/') + 1:],
                     url=file.generate_signed_url(datetime.today() +
                                                  timedelta(days=1))))

        task = task.to_mongo().to_dict()
        # map id and files field of dict
        task['_id'] = str(task['_id'])
        task['files'] = urls

    except Task.DoesNotExist:
        return jsonify(status=False,
                       message="Task id=%s không tồn tại." % id), 400

    return jsonify(status=True, data=task), 200


# API for accepting task
# used by employees / officers
@api.route("/accept-task/<id>", methods=["PUT"])
def accept_task(id):
    # data = request.json
    # NOTE: Chưa xử lý check đăng nhập
    # Xử lý kiểm tra id user cookie tồn tại trong id ng giao/nhận
    user_id = "5"

    try:
        task = Task.objects(id=id).get()
        # Chỉ người nhận task được access
        if task.officer_id != user_id:
            return jsonify(status=False,
                           message="Không có quyền truy cập Task này"), 400

        if task.status != TaskStatus.objects(id=TaskStatusDefined.NEW).get(
        ) and task.status != TaskStatus.objects(
                id=TaskStatusDefined.REJECTED).get():
            return jsonify(status=False,
                           message="Không thể bắt đầu Task này"), 400

        task.status = TaskStatus.objects(
            id=TaskStatusDefined.IN_PROGRESS).get()
        task.save()
        return jsonify(status=True,
                       message="Chấp nhận Task thành công"), 200
    except Task.DoesNotExist:
        return jsonify(status=False,
                       message="Task id=%s không tồn tại." % id), 400


# API for canceling task
# used by manager only / người giao
@api.route("/cancel-task/<id>", methods=["PUT"])
def cancel_task(id):
    # data = request.json
    # NOTE: Chưa xử lý check đăng nhập
    # Xử lý kiểm tra id user cookie tồn tại trong id ng giao/nhận
    user_id = "1"

    try:
        task = Task.objects(id=id).get()
        # Chỉ người giao nhiệm vụ được hủy
        if task.manager_id != user_id:
            return jsonify(status=False,
                           message="Không có quyền truy cập Task này"), 400

        if task.status == TaskStatus.objects(
                id=TaskStatusDefined.COMPLETED).get():
            return jsonify(status=False,
                           message="Không thể hủy Task đã hoàn thành"), 400

        task.status = TaskStatus.objects(id=TaskStatusDefined.CANCELED).get()
        task.save()
        return jsonify(status=True, message="Hủy bỏ Task thành công"), 200
    except Task.DoesNotExist:
        return jsonify(status=False,
                       message="Task id=%s không tồn tại." % id), 400


# API for submitting task
# used by officer only - người được giao
@api.route("/submit-task/<id>", methods=["PUT"])
def submit_task(id):
    data = request.form
    user_id = "5"

    data = validate_conversation_data(data)

    if data.get('status') == False:
        return jsonify(data), 400

    # NOTE: Chưa xử lý check đăng nhập
    # Xử lý kiểm tra id user cookie tồn tại trong id ng giao/nhận

    try:
        task = Task.objects(id=id).get()
        # Chỉ người giao nhiệm vụ được hủy
        if task.officer_id != user_id:
            return jsonify(status=False,
                           message="Không có quyền truy cập Task này"), 400

        if task.status != TaskStatus.objects(
                id=TaskStatusDefined.IN_PROGRESS).get():
            return jsonify(status=False,
                           message="Chỉ được submit Task đang thực hiện"), 400

    except Task.DoesNotExist:
        return jsonify(status=False,
                       message="Task id=%s không tồn tại." % id), 400

    bucket = storage.bucket()
    data = data.get('data')

    conversation = TaskConversation(user_id=user_id,
                                    content=data.get('content', ''))

    # Trường hợp upload file > MAX_CONTENT_LENGTH
    # Hệ thống quăng error 413 -> Đã handle error
    try:
        for file in request.files.getlist('files'):
            file_path = 'task_conversations/task_id_%s/%s/%s' % (
                id, str(conversation.id), file.filename)
            file.save('temp/%s' % file.filename)
            blob = bucket.blob(file_path)
            blob.upload_from_filename('temp/%s' % file.filename)
            os.remove('temp/%s' % file.filename)
    except Exception as e:
        for f in os.listdir('temp'):
            os.remove(os.path.join('temp', f))
        print(str(e))
        return jsonify(
            status=False,
            message=
            'Đã có lỗi xảy ra trong quá trình upload file. Vui lòng liên hệ Admin để kiểm tra hệ thống'
        ), 400

    task.conversations.append(conversation)
    task.status = TaskStatus.objects(id=TaskStatusDefined.WAITING).get()
    task.save()
    return jsonify(status=True, message="Submit Task thành công"), 200


# API for approving task
# used by manager only - người giao công việc
# Đánh giá task
@api.route("/approve-task/<id>", methods=["PUT"])
def approve_task(id):
    data = request.json
    # NOTE: Chưa xử lý check đăng nhập
    # Xử lý kiểm tra id user cookie tồn tại trong id ng giao/nhận
    user_id = "1"

    data = validate_task_rate_data(data)

    if data.get('status') == False:
        return jsonify(data), 400

    data = data.get('data')

    try:
        task = Task.objects(id=id).get()
        # Chỉ người giao nhiệm vụ được hủy
        if task.manager_id != user_id:
            return jsonify(status=False,
                           message="Không có quyền truy cập Task này"), 400

        if task.status != TaskStatus.objects(
                id=TaskStatusDefined.WAITING).first():
            return jsonify(
                status=False,
                message="Task không trong trạng thái chờ duyệt"), 400

        task.status = TaskStatus.objects(id=TaskStatusDefined.COMPLETED).get()
        task.rate = data.get('rate')

        task.save()
        return jsonify(status=True,
                       message="Đánh giá hoàn thành thành công"), 200
    except Task.DoesNotExist:
        return jsonify(status=False,
                       message="Task id=%s không tồn tại." % id), 400


# API for rejecting task
# used by manager only - người giao công việc
# Đánh giá task
@api.route("/reject-task/<id>", methods=["PUT"])
def reject_task(id):
    data = request.form
    # NOTE: Chưa xử lý check đăng nhập
    # Xử lý kiểm tra id user cookie tồn tại trong id ng giao/nhận
    user_id = "1"
    data = validate_conversation_data(data)

    if data.get('status') == False:
        return jsonify(data), 400

    try:
        task = Task.objects(id=id).get()
        # Chỉ người giao nhiệm vụ được hủy
        if task.manager_id != user_id:
            return jsonify(status=False,
                           message="Không có quyền truy cập Task này"), 400

        if task.status != TaskStatus.objects(
                id=TaskStatusDefined.WAITING).get():
            return jsonify(
                status=False,
                message="Task không trong trạng thái chờ duyệt"), 400

        bucket = storage.bucket()
        data = data.get('data')

        conversation = TaskConversation(user_id=user_id,
                                        content=data.get('content', ''))

        # Trường hợp upload file > MAX_CONTENT_LENGTH
        # Hệ thống quăng error 413 -> Đã handle error
        try:
            for file in request.files.getlist('files'):
                file_path = 'task_conversations/task_id_%s/%s/%s' % (
                    id, str(conversation.id), file.filename)
                file.save('temp/%s' % file.filename)
                blob = bucket.blob(file_path)
                blob.upload_from_filename('temp/%s' % file.filename)
                os.remove('temp/%s' % file.filename)
        except Exception as e:
            for f in os.listdir('temp'):
                os.remove(os.path.join('temp', f))
            print(str(e))
            return jsonify(
                status=False,
                message=
                'Đã có lỗi xảy ra trong quá trình upload file. Vui lòng liên hệ Admin để kiểm tra hệ thống'
            ), 400

        task.conversations.append(conversation)
        task.status = TaskStatus.objects(id=TaskStatusDefined.REJECTED).get()
        task.save()

        return jsonify(status=True, message="Phản hồi Task thành công"), 200
    except Task.DoesNotExist:
        return jsonify(status=False,
                       message="Task id=%s không tồn tại." % id), 400