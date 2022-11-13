const { check } = require('express-validator')

const validatorForgotPasswordEmailAndPhoneNumber = [
    check('phone_number')
    .notEmpty()
    .withMessage('Vui lòng nhập số điện thoại !')
    .isMobilePhone('vi-VN')
    .withMessage('Định dạng số điện thoại không hợp lệ ! Hệ thống chỉ hỗ trợ số điện thoại Việt Nam'),

    check('email')
    .notEmpty()
    .withMessage('Vui lòng nhập email !')
    .isEmail().withMessage('Định dạng email không hợp lệ !'),
];

const validatorForgotPasswordOTP = [
    check('phone_number')
    .notEmpty()
    .withMessage('Vui lòng nhập số điện thoại !')
    .isMobilePhone('vi-VN')
    .withMessage('Định dạng số điện thoại không hợp lệ ! Hệ thống chỉ hỗ trợ số điện thoại Việt Nam'),

    check('email')
    .notEmpty()
    .withMessage('Vui lòng nhập email !')
    .isEmail().withMessage('Định dạng email không hợp lệ !'),

    check('forgot-password-otp')
    .notEmpty()
    .withMessage('Vui lòng nhập mã OTP đã được gửi đến email !'),
]


module.exports = {
    validatorForgotPasswordEmailAndPhoneNumber,
    validatorForgotPasswordOTP,
}