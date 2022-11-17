from datetime import datetime
from ..documents import TaskRate


def validate_task_data(data):
    officer_id = data.get("officer_id", None)
    title = data.get("title", "")
    description = data.get("description", "")
    deadline = data.get("deadline", None)

    if officer_id is None:
        return dict(status=False, message="Vui lòng chọn nhân viên đảm nhận công việc")
    if len(title) < 1:
        return dict(status=False, message="Vui lòng nhập tiêu đề công việc")
    if len(description) < 1:
        return dict(status=False, message="Vui lòng nhập mô tả công việc")
    if deadline is None:
        return dict(status=False, message="Vui lòng nhập deadline công việc")
    try:
        datetime.strptime(deadline, "%Y-%m-%d")
    except ValueError:
        return dict(status=False, message="Format Deadline không hợp lệ")

    return dict(status=True, data=dict(data))


def validate_reject_task_data(data):
    content = data.get("content", "")
    deadline = data.get("deadline", None)

    if len(content) < 1:
        return dict(status=False, message="Vui lòng nhập lời nhắn báo cáo")
    if deadline is None:
        return dict(status=False, message="Vui lòng nhập deadline công việc")
    try:
        deadline = datetime.strptime(deadline, "%Y-%m-%d")
        deadline = deadline.replace(hour=23, minute=59, second=59)
    except ValueError:
        return dict(status=False, message="Format Deadline không hợp lệ")
    return dict(status=True, data=dict(data))


def validate_task_rate_data(data):
    rate = data.get("rate", -1)

    if rate == -1:
        return dict(
            status=False, message="Vui lòng đánh giá mức độ hoàn thành công việc"
        )
    try:
        rate = TaskRate.objects(id=rate).first()
    except TaskRate.DoesNotExist:
        return dict(status=False, message="Loại đánh giá không đúng")

    return dict(status=True, data=dict(rate=rate))
