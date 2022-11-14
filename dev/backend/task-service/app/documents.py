from datetime import datetime
from flask_mongoalchemy import BaseQuery
from . import db


class MyCustomizedQuery(BaseQuery):
    def get_johns(self):
        return self.filter(self.type.first_name == "John")


class TaskConversation(db.Document):
    user_id = db.StringField()
    content = db.StringField()


class Task(db.Document):
    manager_id = db.StringField()
    officer_id = db.StringField()
    title = db.StringField()
    description = db.StringField()
    status = db.IntField()
    updated_at = db.DateTimeField()
    deadline = db.DateTimeField()
    rate = db.IntegerField()

    conversations = db.ListField(db.DocumentField(TaskConversation))

    def __init__(self, **kwargs):
        super(Task, self).__init__(**kwargs)
        self.updated_at = datetime.datetime.now()
