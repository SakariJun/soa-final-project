const { check } = require('express-validator')

// Validate cho trường hợp - Đổi mật khẩu lần đầu tiên đăng nhập
// Validate mật khẩu mới + mật khẩu mới xác nhận
const validatorState = [check('state').notEmpty().withMessage('Vui lòng chọn trạng thái tài khoản cần xem danh sách !')]

const validatorUpdateState = [
	check('state')
		.notEmpty()
		.withMessage('Vui lòng gửi kèm trạng thái cần cập nhật !')
		.isNumeric()
		.withMessage('Giá trị trạng thái tài khoản không hợp lệ !'),

	check('username')
		.notEmpty()
		.withMessage('Vui lòng nhập tên tài khoản !')
		.isLength({ min: 10, max: 10 })
		.withMessage('Tên tài khoản phải đúng 10 ký tự !')
		.isNumeric()
		.withMessage('Tên tài khoản chỉ được phép chứa các ký tự từ 0-9 !')
		.trim(),
]

const validatorUnbannedAccount = [
	check('username')
		.notEmpty()
		.withMessage('Vui lòng nhập tên tài khoản !')
		.isLength({ min: 10, max: 10 })
		.withMessage('Tên tài khoản phải đúng 10 ký tự !')
		.isNumeric()
		.withMessage('Tên tài khoản chỉ được phép chứa các ký tự từ 0-9 !')
		.trim(),
]

module.exports = { validatorUpdateState, validatorState, validatorUnbannedAccount }
