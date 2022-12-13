const { check } = require('express-validator');

module.exports = [
    check('username')
        .notEmpty()
        .withMessage('Vui lòng nhập tên tài khoản !')
        .isLength({ min: 7 })
        .withMessage('Tên tài khoản phải ít nhất 7 ký tự !')
        .isNumeric()
        .withMessage('Tên tài khoản chỉ được phép chứa các ký tự từ 0-9 !')
        .trim(),

    check('password').notEmpty().withMessage('Vui lòng nhập mật khẩu !').trim(),
];
