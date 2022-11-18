from flask import Blueprint
from ..models import Permission, Role

main = Blueprint("main", __name__)


@main.app_context_processor
def inject_permissions():
    return dict(Permission=Permission)


@main.app_context_processor
def inject_roles():
    # Request api to get roles id - name
    roles = [
        {
            "id": "1",
            "name": "Nhân Viên",
            "permissions": [
                Permission.READ_TASK,
                Permission.SUBMIT_TASK,
                Permission.REQUEST_ABSENT,
            ],
        },
        {
            "id": "2",
            "name": "Trưởng Phòng",
            "permissions": [
                Permission.READ_TASK,
                Permission.MODIFY_TASK,
                Permission.REQUEST_ABSENT,
                Permission.REVIEW_ABSENT,
            ],
        },
        {
            "id": "6375a605f912fa4857d6f488",
            "name": "Giám Đốc",
            "permissions": [
                Permission.MODIFY_DEPARTMENT,
                Permission.MODIFY_USER,
                Permission.REVIEW_ABSENT,
            ],
        },
    ]

    role_list = {}

    for r in roles:
        role = Role(r["id"], r["name"])
        for p in r["permissions"]:
            role.add_permission(p)
        role_list[role.id] = role

    return dict(Role=role_list)


from . import views, errors
