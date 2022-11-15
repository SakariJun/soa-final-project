const { validateLogin, authenticationUser } = require('../services/login.service')

const validateLoginController = async (req, res, next) => {
	const validationResult = validateLogin(req)

	if (!validationResult.status) {
		return res.status(200).json(validationResult)
	}

	const authenticationUserResult = await authenticationUser(req.body.username, req.body.password)

	if (!authenticationUserResult.status) {
		return res.status(400).json(authenticationUserResult)
	}

	const newDate = new Date()
	const expDate = newDate.setMonth(newDate.getMonth() + 3)
	res.cookie('accessToken', authenticationUserResult.accessToken)

	return res.status(200).json(authenticationUserResult)
}

module.exports = { validateLoginController }
