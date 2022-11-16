from datetime import datetime


def validate_task_data(data):
    officer_id = data.get('officer_id', None)
    title = data.get('title', "")
    description = data.get('description', "")
    deadline = data.get('deadline', None)

    if officer_id is None:
        return dict(status=False, message='Vui lòng chọn nhân viên đảm nhận công việc')
    if len(title) < 1:
        return dict(status=False, message='Vui lòng nhập tiêu đề công việc')
    if len(description) < 1:
        return dict(status=False, message='Vui lòng nhập mô tả công việc')
    if deadline is None:
        return dict(status=False, message='Vui lòng nhập deadline công việc')
    try:
        deadline = datetime.strptime(deadline, '%Y-%m-%d')
        deadline = deadline.replace(hour=23, minute=59, second=59)
    except ValueError:
        return dict(status=False, message='Format Deadline không hợp lệ')

    return dict(status=True,
                data=dict(data))
