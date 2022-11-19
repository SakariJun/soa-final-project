from flask import current_app
from requests import get


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
    # Dữ liệu roles
    role_list = {}

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

    @staticmethod
    def get_roles_data() -> dict:
        data = get(current_app.config["USER_SERVICE"] + "/role/get-all-role")
        data = data.json()

        # Add cứng từ db, kh có chức năng thay đổi quyền
        permissions = {
            "Nhân viên": [
                Permission.READ_TASK,
                Permission.SUBMIT_TASK,
                Permission.REQUEST_ABSENT,
            ],
            "Trưởng phòng": [
                Permission.READ_TASK,
                Permission.MODIFY_TASK,
                Permission.REQUEST_ABSENT,
                Permission.REVIEW_ABSENT,
            ],
            "Giám đốc": [
                Permission.MODIFY_DEPARTMENT,
                Permission.MODIFY_USER,
                Permission.REVIEW_ABSENT,
            ],
        }

        if data is not None and data.get("status") == True:
            roles = data.get("data", Role.default_role())
        else:
            roles = Role.default_role()

        for r in roles:
            role = Role(r["_id"], r["name"])

            for p in permissions[r['name']]:
                role.add_permission(p)
            Role.role_list[role.id] = role
        return Role.role_list

    @staticmethod
    def default_role() -> list:
        roles = [
            {
                "_id": "63732c453e5f00fee0aab76b",
                "name": "Nhân viên",
                "permissions": [
                    Permission.READ_TASK,
                    Permission.SUBMIT_TASK,
                    Permission.REQUEST_ABSENT,
                ],
            },
            {
                "_id": "63732c0c3e5f00fee0aab768",
                "name": "Trưởng phòng",
                "permissions": [
                    Permission.READ_TASK,
                    Permission.MODIFY_TASK,
                    Permission.REQUEST_ABSENT,
                    Permission.REVIEW_ABSENT,
                ],
            },
            {
                "_id": "63732c1e3e5f00fee0aab769",
                "name": "Giám đốc",
                "permissions": [
                    Permission.MODIFY_DEPARTMENT,
                    Permission.MODIFY_USER,
                    Permission.REVIEW_ABSENT,
                ],
            },
        ]
        return roles
