const { check } = require('express-validator')

module.exports = [
	check('username')
		.notEmpty()
		.withMessage('Vui lòng nhập tên tài khoản !')
		.isLength({ min: 10, max: 10 })
		.withMessage('Tên tài khoản phải đúng 10 ký tự !')
		.isNumeric()
		.withMessage('Tên tài khoản chỉ được phép chứa các ký tự từ 0-9 !')
		.trim(),

	check('password')
		.notEmpty()
		.withMessage('Vui lòng nhập mật khẩu !')
		.isLength({ min: 6, max: 6 })
		.withMessage('Mật khẩu phải đúng 6 ký tự !')
		.trim(),
]
