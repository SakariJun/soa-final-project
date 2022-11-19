from flask import Blueprint
from ..models import Permission, Role

main = Blueprint("main", __name__)


@main.app_context_processor
def inject_permissions():
    return dict(Permission=Permission)


@main.app_context_processor
def inject_roles():
    # Sử dụng static variable để request 1 lần data
    if len(Role.role_list) < 1:
        return dict(Role=Role.get_roles_data())
    return dict(Role=Role.role_list)


from . import views, errors
