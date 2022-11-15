from flask import (
    render_template,
    redirect,
    url_for,
    abort,
    flash,
    request,
    current_app,
    make_response,
)
from . import api
from ..documents import TaskConversation, Task
from datetime import datetime


'''
API get constraint of Task
'''
@api.route("/status", methods=["POST"])
def get_contraint():
    task = Task(
        manager_id=str(1),
        officer_id=str(1),
        title="yahallo",
        description="hello ",
        status=1,
        deadline=datetime.utcnow(),
        rate=1,
    )
    task.save()
    return "hello world"

'''
API for create a new task
body: {
    manager_id -> str
    officer_id -> str
    title -> str
    description -> str
    status -> int
    updated_at -> datetime
    deadline -> datetime
    rate -> int
}
'''
@api.route("/create-task", methods=["POST"])
def create_task():
    task = Task(
        manager_id=str(1),
        officer_id=str(1),
        title="yahallo",
        description="hello ",
        status=1,
        deadline=datetime.utcnow(),
        rate=1,
    )
    task.save()
    return "hello world"


@api.route("/accept-task", methods=["GET"])
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
