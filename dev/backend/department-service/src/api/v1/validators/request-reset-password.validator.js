const { check } = require('express-validator');

module.exports = [
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
];
