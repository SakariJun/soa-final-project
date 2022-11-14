from datetime import datetime
from flask_mongoengine import BaseQuerySet
from bson.objectid import ObjectId
from . import db


class MyCustomizedQuery(BaseQuerySet):
    def get_johns(self):
        return self.filter(self.type.first_name == "John")


class TaskConversation(db.EmbeddedDocument):
    _oid = db.ObjectIdField(required=True, default=ObjectId, unique=True, primary_key=True)
    user_id = db.StringField(required=True)
    content = db.StringField(required=True)
    created_at = db.DateTimeField(default=datetime.now())


class Task(db.Document):
    manager_id = db.StringField(required=True)
    officer_id = db.StringField(required=True)
    title = db.StringField(required=True)
    description = db.StringField(required=True)
    status = db.IntField(default=0)
    updated_at = db.DateTimeField(default=datetime.now())
    deadline = db.DateTimeField(required=True)
    rate = db.IntField()

    conversations = db.ListField(db.EmbeddedDocumentField(TaskConversation))
