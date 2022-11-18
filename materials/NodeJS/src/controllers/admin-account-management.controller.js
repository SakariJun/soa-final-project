const adminAccountManagementService = require('../services/admin-account-management.service')

const getUserAccountsByStateController = async (req, res, next) => {
	// Gọi hàm validate input từ service
	const isInputValid = adminAccountManagementService.validateState(req)

	if (!isInputValid.status) {
		return res.status(400).json(isInputValid)
	}

	// Validate thành công -> Tiến hành thao tác đăng ký
	const getUserAccountsByStateResult = await adminAccountManagementService.getUserAccountsByState(req.params.state)

	if (!getUserAccountsByStateResult.status) {
		return res.status(400).json(getUserAccountsByStateResult)
	}

	return res.status(201).json(getUserAccountsByStateResult)
}

const getBannedUserAccountsController = async (req, res, next) => {
	const getBannedUserAccountsResult = await adminAccountManagementService.getBannedUserAccounts()

	if (!getBannedUserAccountsResult.status) {
		return res.status(400).json(getBannedUserAccountsResult)
	}

	return res.status(200).json(getBannedUserAccountsResult)
}

const updateUserAccountStateController = async (req, res, next) => {
	// Gọi hàm validate input từ service
	const isInputValid = adminAccountManagementService.validateUpdateState(req)

	if (!isInputValid.status) {
		return res.status(400).json(isInputValid)
	}

	const updateUserAccountStateResult = await adminAccountManagementService.updateUserAccountState(
		req.body.username,
		req.body.state,
	)

	if (!updateUserAccountStateResult.status) {
		return res.status(400).json(updateUserAccountStateResult)
	}

	return res.status(201).json(updateUserAccountStateResult)
}

const unbannedAccountController = async (req, res, next) => {
	// Gọi hàm validate input từ service
	const isInputValid = adminAccountManagementService.validateUnbannedAccount(req)

	if (!isInputValid.status) {
		return res.status(400).json(isInputValid)
	}

	const updateUserAccountStateResult = await adminAccountManagementService.unbannedAccount(req.body.username)

	if (!updateUserAccountStateResult.status) {
		return res.status(400).json(updateUserAccountStateResult)
	}

	return res.status(201).json(updateUserAccountStateResult)
}

module.exports = {
	getUserAccountsByStateController,
	getBannedUserAccountsController,
	updateUserAccountStateController,
	unbannedAccountController,
}
