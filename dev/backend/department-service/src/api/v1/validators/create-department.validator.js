const { check } = require('express-validator');

const createDepartmentValidator = [
    check('phone_number')
        .notEmpty()
        .withMessage('Vui lòng nhập số điện thoại !')
        .not()
        .isMobilePhone('vi-VN')
        .withMessage('Định dạng số điện thoại không hợp lệ ! Hệ thống chỉ hỗ trợ số điện thoại Việt Nam'),

    check('email')
        .notEmpty()
        .withMessage('Vui lòng nhập email !')
        .isEmail()
        .withMessage('Định dạng email không hợp lệ!'),

    check('full_name')
        .notEmpty()
        .withMessage('Vui lòng nhập họ tên !')
        .matches("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
        .withMessage('Trong họ tên chứa các ký tự không hợp lệ!'),

    check('day_of_birth').notEmpty().withMessage('Vui lòng nhập ngày sinh của nhân viên!'),

    check('gender').notEmpty().withMessage('Vui lòng chọn giới tính của nhân viên!'),

    check('department_id').notEmpty().withMessage('Vui lòng chọn phòng ban cho nhân viên!'),

    check('role_name').notEmpty().withMessage('Vui lòng chọn chức vụ của nhân viên!'),
];

module.exports = createDepartmentValidator;
