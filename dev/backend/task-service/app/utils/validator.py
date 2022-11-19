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
        deadline = datetime.strptime(deadline, "%Y-%m-%d")
        # Sử dụng "<" vì thời gian deadline mặc định là cuối ngày ( 23h59'59s )
        # Thời gian cùng ngày vẫn được tạo
        if deadline.date() < datetime.now().date():
            return dict(status=False, message="Deadline không phải trong quá khứ")

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
        # Sử dụng "<" vì thời gian deadline mặc định là cuối ngày ( 23h59'59s )
        # Thời gian cùng ngày vẫn được tạo
        if deadline.date() < datetime.now().date():
            return dict(status=False, message="Deadline không phải trong quá khứ")
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
        # Sử dụng get() thay vì first()
        # get() không tìm thấy sẽ thrown DoesNotExist để bắt lỗi
        rate = TaskRate.objects(id=rate).get()
    except TaskRate.DoesNotExist:
        return dict(status=False, message="Loại đánh giá không đúng")

    return dict(status=True, data=dict(rate=rate))
