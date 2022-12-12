from datetime import datetime, timedelta
from bson.objectid import ObjectId
from . import db


class TaskStatusDefined:
    NEW = 0
    IN_PROGRESS = 1
    CANCELED = 2
    WAITING = 3
    REJECTED = 4
    COMPLETED = 5

    def __iter__(self):
        yield from {
            self.NEW: "New",
            self.IN_PROGRESS: "In progress",
            self.CANCELED: "Canceled",
            self.WAITING: "Waiting",
            self.REJECTED: "Rejected",
            self.COMPLETED: "Completed",
        }.items()


class TaskStatus(db.Document):
    id = db.IntField(primary_key=True)
    status = db.StringField()

    @staticmethod
    def insert_task_status():
        for id, status in dict(TaskStatusDefined()).items():
            TaskStatus(id=id, status=status).save()


class Rate:
    BAD = 0
    OK = 1
    GOOD = 2

    def __iter__(self):
        yield from {
            self.BAD: "Bad",
            self.OK: "Ok",
            self.GOOD: "Good",
        }.items()


class TaskRate(db.Document):
    id = db.IntField(primary_key=True)
    rate = db.StringField()

    @staticmethod
    def insert_task_rate():
        for id, rate in dict(Rate()).items():
            TaskRate(id=id, rate=rate).save()


# Task conversations
# Quá trình trao đổi - đánh giá giữa người giao và người được giao
class TaskConversation(db.EmbeddedDocument):
    id = db.ObjectIdField(required=True, default=ObjectId, primary_key=True)
    user_id = db.StringField(required=True)
    content = db.StringField(required=True)
    created_at = db.DateTimeField(default=datetime.now())


# Task documents
# manager_id    - mã người giao ( trưởng phòng )
# officer_id    - mã người được giao ( nhân viên )
# title         - tiêu đề công việc
# description   - mô tả công việc - viẹc cần làm
# status        - trạng thái công việc hiện tại ( mới tạo sẽ là New )
# updated_at    - thời điểm cuối cùng được cập nhật
# deadline      - deadline sớm nhất phải trong ngày công việc được tạo
# rate          - đánh giá mức độ hoàn thành công việc
class Task(db.Document):
    manager_id = db.StringField(required=True)
    officer_id = db.StringField(required=True)
    title = db.StringField(required=True)
    description = db.StringField(required=True)
    priority = db.IntField(required=True, default=1)
    status = db.ReferenceField(TaskStatus)
    updated_at = db.DateTimeField(default=datetime.now())
    deadline = db.DateTimeField(required=True)
    rate = db.ReferenceField(TaskRate)

    conversations = db.ListField(db.EmbeddedDocumentField(TaskConversation))

    # Update updated_time mỗi khi có lưu thay đổi mới
    def save(self, *args, **kwargs):
        if not self.status:
            self.status = TaskStatus.objects.get(status="New")
        self.updated_at = datetime.now()

        # +23h59m59s -> deadline hết ngày
        if isinstance(self.deadline, str):
            self.deadline = datetime.strptime(self.deadline, "%Y-%m-%d") + timedelta(
                hours=23, minutes=59, seconds=59
            )

        return super(Task, self).save(*args, **kwargs)
