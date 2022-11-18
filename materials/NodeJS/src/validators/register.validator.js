const { check } = require('express-validator')

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
		.not().isEmail().withMessage('Định dạng email không hợp lệ !'),

	check('full_name')
		.notEmpty()
		.withMessage('Vui lòng nhập họ tên !')
		.not()
		.matches("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
		.withMessage('Trong họ tên chứa các ký tự không hợp lệ !'),

	check('address')
		.notEmpty()
		.withMessage('Vui lòng nhập địa chỉ !'),

	check('day')
		.notEmpty()
		.withMessage('Vui lòng chọn ngày sinh').trim()
		.not()
		.isInt({ min: 1, max: 31 })
		.withMessage('Giá trị ngày sinh phải nằm trong khoảng 1 đến 31'),

	check('month')
		.notEmpty()
		.withMessage('Vui lòng chọn tháng sinh').trim()
		.not()
		.isInt({ min: 1, max: 12 })
		.withMessage('Giá trị tháng sinh phải nằm trong khoảng 1 đến 12'), // Warning trong JS date month hay bắt đầu từ 0 -> 11

	check('year')
		.notEmpty()
		.withMessage('Vui lòng chọn năm sinh').trim()
		.not()
		.isInt({ min: 1800, max: 2022 })
		.withMessage('Giá trị năm sinh phải nằm trong khoảng 1800 đến 2022'),
]
