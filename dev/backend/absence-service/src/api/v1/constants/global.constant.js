exports.ID_DIGITS = 5;

exports.ROLE_NAME_DIRECTOR = 'Giám đốc';
exports.ROLE_NAME_LEADER = 'Trưởng phòng';
exports.ROLE_NAME_EMPLOYEE = 'Nhân viên';

exports.MAX_ABSENCE_DAY_LEADER = 15;
exports.MAX_ABSENCE_DAY_EMPLOYEE = 12;

exports.ABSENCE_REQUEST_STATE_WAITING = 0;
exports.ABSENCE_REQUEST_STATE_APPROVED = 1;
exports.ABSENCE_REQUEST_STATE_REFUSED = 2;

// Events của Service User
exports.SERVICE_USER = process.env.USER_SERVICE_URL;
// Lấy role của nhân viên = mã nhân viên
exports.SERVICE_USER_EVENTS_GET_ROLE_BY_USER_ID = 1;
// Set role nhân viên = mã nhân viên
exports.SERVICE_USER_EVENTS_SET_ROLE_BY_USER_ID = 2;
// Lấy danh sách user_id bằng tên chức vụ
exports.SERVICE_USER_EVENTS_GET_USERS_ID_BY_ROLE_NAME = 3;
// Lấy danh sách user_id bằng mã phòng ban
exports.SERVICE_USER_EVENTS_GET_USERS_ID_BY_DEPARTMENT_ID = 4;

// Events của Service Absence
exports.SERVICE_ABSENCE = process.env.ABSENCE_SERVICE_URL;
exports.SERVICE_ABSENCE_EVENTS_CREATE_ABSENCE_INFORMATION = 1;
exports.SERVICE_ABSENCE_EVENTS_UPDATE_ABSENCE_INFORMATION = 2;
exports.SERVICE_ABSENCE_EVENTS_GET_ABSENCE_INFORMATION = 3;

// Events của Service Department
exports.SERVICE_DEPARTMENT = process.env.DEPARTMENT_SERVICE_URL;
exports.SERVICE_DEPARTMENT_EVENT_GET_DEPARTMENT_BY_DEPARTMENT_ID = 1;
// Events của Service Task
exports.SERVICE_TASK = process.env.TASK_SERVICE_URL;
