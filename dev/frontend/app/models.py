class Permission:
    READ_TASK = 1
    SUBMIT_TASK = 2
    MODIFY_TASK = 4
    # Quản lý phòng ban
    MODIFY_DEPARTMENT = 8
    # Thay đổi chức vụ - add user
    # chỉnh lương - reset password
    MODIFY_USER = 16
    # Xin nghỉ
    REQUEST_ABSENT = 32
    # approve / reject requests
    REVIEW_ABSENT = 64


class Role:
    id = ""
    name = ""
    permission = 0

    def __init__(self, id, name):
        self.id = id
        self.name = name
        if self.permission is None:
            self.permission = 0

    def has_permission(self, perm):
        return (self.permission & perm) == perm

    def add_permission(self, perm):
        if not self.has_permission(perm):
            self.permission += perm

    def remove_permission(self, perm):
        if self.has_permission(perm):
            self.permission -= perm

    def reset_permissions(self):
        self.permission = 0
