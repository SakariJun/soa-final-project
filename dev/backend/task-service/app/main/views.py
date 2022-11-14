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
from . import main
from ..documents import TaskConversation, Task
from datetime import datetime


@main.route("/", methods=["GET"])
def index():
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
    
    conv = TaskConversation(user_id=str(1), content="hello ha")
    task.conversations.append(conv)
    task.save()
    return "hello world"

@main.route("/comment", methods=["GET"])
def comment():
    task = Task.objects(id='637296ce7ed7ad582dc6a504').get()
    conv = TaskConversation(user_id=str(3), content="hello haha ha")
    task.conversations.append(conv)
    task.save()
    return "hello world"

@main.route("/comments", methods=["GET"])
def comments():
    task = Task.objects.first()
    return str(task.to_json())