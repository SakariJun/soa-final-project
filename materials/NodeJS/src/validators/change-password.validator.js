const { check } = require('express-validator')

// Validate cho trường hợp - Đổi mật khẩu lần đầu tiên đăng nhập
// Validate mật khẩu mới + mật khẩu mới xác nhận
const validatorChangePasswordRequire = [
    check("new-password")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu mới !").trim()
        .isLength({ min: 6, max: 6 })
        .withMessage("Mật khẩu phải chứa đúng 6 ký tự !"),

    check("new-password-confirm")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu xác nhận !").trim()
        .isLength({ min: 6, max: 6 })
        .withMessage("Mật khẩu xác nhận phải chứa đúng 6 ký tự !"),
];

const validatorChangePasswordOptional = [
    check("old-password")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu cũ !").trim()
        .isLength({ min: 6, max: 6 })
        .withMessage("Mật khẩu cũ phải chứa đúng 6 ký tự !"),

    check("new-password")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu mới !").trim()
        .isLength({ min: 6, max: 6 })
        .withMessage("Mật khẩu phải chứa đúng 6 ký tự !"),

    check("new-password-confirm")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu xác nhận !").trim()
        .isLength({ min: 6, max: 6 })
        .withMessage("Mật khẩu xác nhận phải chứa đúng 6 ký tự !"),
];



module.exports = { validatorChangePasswordRequire, validatorChangePasswordOptional }
