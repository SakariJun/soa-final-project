from flask import Blueprint
from ..models import Permission, Role
from bson.objectid import ObjectId
from datetime import datetime

main = Blueprint("main", __name__)

# global filter settings
@main.app_template_filter()
def strptime(value):
    return datetime.strptime(value, "%a, %d %b %Y %H:%M:%S GMT").strftime("%Y-%m-%d")


@main.app_context_processor
def inject_permissions():
    return dict(Permission=Permission)


@main.app_context_processor
def inject_roles():
    # Sử dụng static variable để request 1 lần data
    if len(Role.role_list) < 1:
        return dict(Role=Role.get_roles_data())
    return dict(Role=Role.role_list)


@main.app_template_global("get_time")
def get_time(objectid):
    return ObjectId(objectid).generation_time


@main.app_template_global("get_file_icon")
def get_file_icon(filetype):
    extension_icons = {
        "zip": "fa-file-archive",
        "rar": "fa-file-archive",
        "gz": "fa-file-archive",
        "7z": "fa-file-archive",
        # image
        "jpg": "fa-file-image",
        "png": "fa-file-image",
        "bmp": "fa-file-image",
        "gif": "fa-file-image",
        # audio
        "mp3": "fa-file-audio",
        "wav": "fa-file-audio",
        "m4a": "fa-file-audio",
        # video
        "mp4": "fa-file-video",
        "mkv": "fa-file-video",
        "mov": "fa-file-video",
        # Document
        "doc": "fa-file-word",
        "docx": "fa-file-word",
        "txt": "fa-file-alt",
        # pdf
        "pdf": "fa-file-pdf",
        # powerpoint
        "ppt": "fa-file-powerpoint",
        "pptx": "fa-file-powerpoint",
        # Excel
        "xlsx": "fa-file-excel",
        "xls": "fa-file-excel",
        # code
        "html": "fa-file-code",
        "css": "fa-file-code",
        "php": "fa-file-code",
        "js": "fa-file-code",
        "c": "fa-file-code",
        "cs": "fa-file-code",
        "java": "fa-file-code",
    }
    return extension_icons.get('filetype', 'fa-file')


from . import views, errors
