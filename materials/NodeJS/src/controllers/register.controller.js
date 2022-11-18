const { validateUserInformation, register } = require('../services/register.service')

const registerController = async (req, res, next) => {
	// Gọi hàm validate input từ service
	const isInputValid = await validateUserInformation(req)

	if (!isInputValid.status) {
		return res.status(400).json(isInputValid);
	}

	// Validate thành công -> Tiến hành thao tác đăng ký
	const registerResult = await register(req);

	if (!registerResult.status) {
		return res.status(400).json(registerResult);
	}

	return res.status(201).json(registerResult);
}

module.exports = { registerController }
