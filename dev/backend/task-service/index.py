import os
from app import create_app, db
from app.documents import TaskStatus, TaskRate

envr = os.getenv("FLASK_CONFIG") or "development"
app = create_app(envr)

if __name__ == "__main__":
    with app.app_context():
        if TaskStatus.objects.count() == 0:
            TaskStatus.insert_task_status()
        if TaskRate.objects.count() == 0:
            TaskRate.insert_task_rate()

    app.run(port=os.getenv("PORT") or 5000)
