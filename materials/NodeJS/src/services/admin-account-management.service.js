const adminAccountManagementRepos = require('../repos/admin-account-management.repos.')
const { validationResult } = require('express-validator')
const DB_CONSTANTS = require('../utils/database-constant-number.utils')

async function getUserAccountsByState(state) {
	const accountsList = await adminAccountManagementRepos.getUserAccountsByState(state)

	let accountsListResult = accountsList[0]

	// Not found any account with Username
	if (accountsListResult.length === 0) {
		return {
			status: false,
			message: `Không tìm thấy tài khoản nào với trạng thái ${state} !`,
		}
	}

	return {
		status: true,
		message: 'Lấy danh sách tài khoản thành công',
		data: accountsListResult,
	}
}

async function getBannedUserAccounts() {
	const accountsList = await adminAccountManagementRepos.getBannedUserAccounts()

	let accountsListResult = accountsList[0]

	// Not found any account with Username
	if (accountsListResult.length === 0) {
		return {
			status: false,
			message: `Không có tài khoản nào đang bị khóa !`,
		}
	}

	return {
		status: true,
		message: 'Lấy danh sách tài khoản bị khóa thành công',
		data: accountsListResult,
	}
}

async function updateUserAccountState(username, state) {
	const updatedAccount = await adminAccountManagementRepos.updateUserAccountState(username, state)

	if (updatedAccount[0].affectedRows === 0) {
		// Generate JWT and send back to client
		return {
			status: false,
			message: 'Cập nhật trạng thái tài khoản thất bại ! Vui lòng thử lại sau',
			data: { username, state },
		}
	}

	return {
		status: true,
		message: 'Cập nhật trạng thái tài khoản thành công',
		data: { username, state },
	}
}

async function unbannedAccount(username) {
	const unbannedAccount = await adminAccountManagementRepos.unbannedAccount(username)

	if (unbannedAccount[0].affectedRows === 0) {
		// Generate JWT and send back to client
		return {
			status: false,
			message: 'Mở khóa tài khoản bị khóa thất bại ! Vui lòng thử lại sau',
			data: { username },
		}
	}

	return {
		status: true,
		message: 'Mở khóa tài khoản bị khóa thành công !',
		data: { username },
	}
}

function validateState(req) {
	const validateLoginResult = validationResult(req)

	if (!validateLoginResult.isEmpty()) {
		return { status: false, message: validateLoginResult.errors[0].msg }
	}

	const validStateValue = [
		DB_CONSTANTS.ACCOUNT_STATE_DISABLE,
		DB_CONSTANTS.ACCOUNT_STATE_VERIFIED,
		DB_CONSTANTS.ACCOUNT_STATE_WAITING_UPDATE,
		DB_CONSTANTS.ACCOUNT_STATE_WAITING_VERIFY,
	]

	if (isNaN(req.params.state)) {
		return { status: false, message: 'Trạng thái tài khoản không hợp lệ !' }
	}

	req.params.state = parseInt(req.params.state)

	if (!validStateValue.includes(req.params.state)) {
		return { status: false, message: 'Trạng thái tài khoản không hợp lệ !' }
	}

	return { status: true, message: 'OKE' }
}

function validateUpdateState(req) {
	const validateLoginResult = validationResult(req)

	if (!validateLoginResult.isEmpty()) {
		return { status: false, message: validateLoginResult.errors[0].msg }
	}

	const validStateValue = [
		DB_CONSTANTS.ACCOUNT_STATE_DISABLE,
		DB_CONSTANTS.ACCOUNT_STATE_VERIFIED,
		DB_CONSTANTS.ACCOUNT_STATE_WAITING_UPDATE,
		DB_CONSTANTS.ACCOUNT_STATE_WAITING_VERIFY,
	]

	if (isNaN(req.body.state)) {
		return { status: false, message: 'Trạng thái tài khoản không hợp lệ !' }
	}

	req.body.state = parseInt(req.body.state)

	if (!validStateValue.includes(req.body.state)) {
		return { status: false, message: 'Trạng thái tài khoản không hợp lệ !' }
	}

	return { status: true, message: 'OKE' }
}

function validateUnbannedAccount(req) {
	const validateResult = validationResult(req)

	if (!validateResult.isEmpty()) {
		return { status: false, message: validateResult.errors[0].msg }
	}

	return { status: true, message: 'OKE' }
}

module.exports = {
	validateState,
	validateUnbannedAccount,
	getUserAccountsByState,
	getBannedUserAccounts,
	updateUserAccountState,
	unbannedAccount,
	validateUpdateState,
}
