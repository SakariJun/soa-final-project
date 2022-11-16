exports.ID_DIGITS = 5;

exports.ROLE_NAME_DIRECTOR = 'Giám đốc';
exports.ROLE_NAME_LEADER = 'Trưởng phòng';
exports.ROLE_NAME_EMPLOYEE = 'Nhân viên';

exports.MAX_ABSENCE_DAY_LEADER = 15;
exports.MAX_ABSENCE_DAY_EMPLOYEE = 12;

// Events của Service User
exports.SERVICE_USER = process.env.USER_SERVICE_URL;
// Lấy role của nhân viên = mã nhân viên
exports.SERVICE_USER_EVENTS_GET_ROLE_BY_USER_ID = 1;
// Set role nhân viên = mã nhân viên
exports.SERVICE_USER_EVENTS_SET_ROLE_BY_USER_ID = 2;

// Events của Service Absence
exports.SERVICE_USER = process.env.ABSENCE_SERVICE_URL;

// Events của Service Department
exports.SERVICE_USER = process.env.DEPARTMENT_SERVICE_URL;

// Events của Service Task
exports.SERVICE_USER = process.env.TASK_SERVICE_URL;
