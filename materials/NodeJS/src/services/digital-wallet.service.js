const DB_CONSTANTS = require('../utils/database-constant-number.utils')
const digitalWalletRepos = require('../repos/digital-wallet.repos')
const userOTPRepos = require('../repos/user-otp.repos')

const { sendMail } = require('../utils/send-mail-util')
const { encryptMessage, decryptMessage } = require('../utils/encrypt-decrypt-string')

const { validationResult } = require('express-validator')

async function rechargeMoneyFromCreditCard(payload, credit_card) {
	const creditCard = await digitalWalletRepos.getCreditCardByCardNumber(credit_card['card_number'])

	let creditCardResult = creditCard[0]

	if (creditCardResult.length === 0) {
		return {
			status: false,
			message: 'Thẻ này không được hỗ trợ',
		}
	}

	creditCardResult = creditCardResult[0]

	if (new Date(creditCardResult['expiry_date']).getTime() !== credit_card['expiry_date'].getTime()) {
		return {
			status: false,
			message: 'Ngày hết hạn thẻ không đúng ! Vui lòng nhập lại !',
		}
	}

	if (creditCardResult['cvv_code'] != credit_card['cvv_code']) {
		return {
			status: false,
			message: 'Mã CVV không đúng ! Vui lòng nhập lại !',
		}
	}

	// Thẻ mã này luôn hết tiền
	if (creditCardResult['card_number'] == '333333') {
		return {
			status: false,
			message: 'Thẻ hết tiền !',
		}
	}

	// Thẻ này nạp tối đa 1 triệu / 1 lần
	if (creditCardResult['card_number'] == '222222') {
		if (credit_card['recharge_amount'] > 1000000) {
			return {
				status: false,
				message: 'Thẻ này chỉ được nạp tối đa 1 triệu/lần!',
			}
		}
	}

	const getUserIDByUsername = await digitalWalletRepos.getUserIDByUsername(payload.username)

	let getUserIDByUsernameResult = getUserIDByUsername[0]

	if (getUserIDByUsernameResult.length === 0) {
		return {
			status: false,
			message: 'Không tìm thấy người dùng ! Vui lòng đăng xuất và đăng nhập lại !',
		}
	}

	getUserIDByUsernameResult = getUserIDByUsernameResult[0]

	const rechargeMoneyResult = await digitalWalletRepos.rechargeMoney(
		getUserIDByUsernameResult['user_id'],
		credit_card['recharge_amount'],
	)

	if (rechargeMoneyResult[0].affectedRows === 0 || rechargeMoneyResult[1].affectedRows === 0) {
		return {
			status: false,
			message: 'Nạp tiền không thành công ! Có lỗi trong quá trình tạo giao dịch và cập nhật số dư !',
		}
	}

	return {
		status: true,
		message: 'Nạp tiền vào ví thành công !',
	}
}

function validateRechargeMoney(req) {
	const validateResult = validationResult(req)

	if (!validateResult.isEmpty()) {
		return { status: false, message: validateResult.errors[0].msg }
	}

	req.body.expiry_date = new Date(
		req.body['year_expiry_date'],
		req.body['month_expiry_date'] - 1,
		req.body['day_expiry_date'],
	) // Tháng trong JS Date bắt đầu từ 0 -> 11

	if (req.body.expiry_date === 'Invalid Date') {
		return {
			status: false,
			message: 'Định dạng ngày hết hạn thẻ không hợp lệ ! Vui lòng nhập lại !',
		}
	}

	return { status: true, message: 'OKE' }
}

async function withdrawMoney(payload, body) {
	body.expiry_date = new Date(body['year_expiry_date'], body['month_expiry_date'] - 1, body['day_expiry_date'])

	if (body.expiry_date === 'Invalid Date') {
		return {
			status: false,
			message: 'Định dạng ngày hết hạn thẻ không hợp lệ. Vui lòng nhập lại.',
		}
	}

	const creditCard = await digitalWalletRepos.getCreditCardByCardNumber(body['card_number'])

	let creditCardResult = creditCard[0]

	// Thẻ không tồn tại trong hệ thống
	if (creditCardResult.length === 0) {
		return {
			status: false,
			message: 'Thẻ này không được hỗ trợ',
		}
	}

	// Kiểm tra thông tin thẻ
	creditCardResult = creditCardResult[0]

	if (new Date(creditCardResult['expiry_date']).getTime() !== body['expiry_date'].getTime()) {
		return {
			status: false,
			message: 'Ngày hết hạn thẻ không đúng. Vui lòng nhập lại.',
		}
	}

	if (creditCardResult['cvv_code'] != body['cvv_code']) {
		return {
			status: false,
			message: 'Mã CVV không đúng. Vui lòng nhập lại.',
		}
	}

	// Chỉ được rút tiền về thẻ 111111
	if (creditCardResult['card_number'] != '111111') {
		return {
			status: false,
			message: 'Thẻ này không được hỗ trợ để rút tiền',
		}
	}

	// Kiểm tra thông tin user
	const getUserIDByUsername = await digitalWalletRepos.getUserIDByUsername(payload.username)

	let getUserIDByUsernameResult = getUserIDByUsername[0]

	if (getUserIDByUsernameResult.length === 0) {
		// Không tồn tại username
		return {
			status: false,
			message: 'Không tìm thấy người dùng. Vui lòng đăng xuất và đăng nhập lại.',
		}
	}

	getUserIDByUsernameResult = getUserIDByUsernameResult[0]

	// Gọi hàm rút tiền từ Repos
	// Note: amount > 5m -> Tạo transaction history + không update ví user
	// Amount phải là bội số 50.000
	// phí giao dịch 5% * amount
	// max 2 lần rút/ngày

	if (body['amount'] % 50000 !== 0) {
		// Không phải bội số của 50.000
		return {
			status: false,
			message: 'Số tiền rút phải là bội số của 50.000',
		}
	}

	// Kiểm tra số lần rút trong ngày
	let today = new Date()
	let month = today.getMonth() + 1
	let day = today.getDate()
	let year = today.getFullYear()

	const withdrawTimes = await digitalWalletRepos.getWithdrawTimesByDate(
		getUserIDByUsernameResult['user_id'],
		day,
		month,
		year,
	)
	let withdrawTimesResult = withdrawTimes[0][0]

	if (withdrawTimesResult['Total'] > 1) {
		// Đã rút hơn 2 lần trong hôm nay
		return {
			status: false,
			message: 'Tối đa 2 lượt rút tiền mỗi ngày. Vui lòng thử lại vào ngày mai.',
		}
	}

	// Check số dư
	const user_balance = await digitalWalletRepos.getBalanceByUserID(getUserIDByUsernameResult['user_id'])

	// Số dư hiện tại < tiền chuyển + phí
	if (user_balance[0][0]['balance'] < body['amount'] * (1 + 5 / 100)) {
		return {
			status: false,
			message: 'Rút tiền thất bại. Số dư không đủ.',
		}
	}

	// Amount > 5m
	const withdrawMoney = await digitalWalletRepos.withdrawMoney(
		getUserIDByUsernameResult['user_id'],
		parseInt(body['amount']),
	)
	let withdrawMoneyResult = withdrawMoney

	if (body['amount'] > 5000000) {
		// Có lỗi xảy ra
		if (withdrawMoneyResult.affectedRows === 0) {
			return {
				status: false,
				message: 'Rút tiền thất bại. Vui lòng thử lại sau.',
			}
		}

		return {
			status: false,
			message: 'Yêu cầu rút tiền nhiều hơn 5000000 đã được gửi. Vui lòng chờ admin xử lý giao dịch.',
		}
	}

	// Có lỗi xảy ra
	if (withdrawMoneyResult[0].affectedRows === 0 || withdrawMoneyResult[1].affectedRows === 0) {
		return {
			status: false,
			message: 'Rút tiền thất bại. Vui lòng thử lại sau.',
		}
	}

	return {
		status: true,
		message: 'Rút tiền về thẻ thành công.',
	}
}

async function transferMoney(payload, body) {
	// Kiểm tra thông tin user
	const getUserByUsername = await digitalWalletRepos.getUserByUsername(payload.username)

	let getUserByUsernameResult = getUserByUsername[0]

	if (getUserByUsernameResult.length === 0) {
		// Không tồn tại username
		return {
			status: false,
			message: 'Không tìm thấy người dùng. Vui lòng đăng xuất và đăng nhập lại.',
		}
	}

	// Thông tin người chuyển
	getUserByUsernameResult = getUserByUsernameResult[0]

	// Thông tin người nhận
	const getUserByPhoneNumber = await digitalWalletRepos.getUserByPhoneNumber(body['send-to'])

	let getUserByPhoneNumberResult = getUserByPhoneNumber[0]

	if (getUserByPhoneNumberResult.length === 0) {
		// Không tìm thấy người nhận nào với sđt này
		return {
			status: false,
			message: 'Không tìm thấy thông tin người nhận. Vui lòng kiểm tra lại.',
		}
	}
	// Thông tin người nhận
	getUserByPhoneNumberResult = getUserByPhoneNumberResult[0]

	// Thông tin giao dịch
	let fromUserID = getUserByUsernameResult['user_id']
	let toUserID = getUserByPhoneNumberResult['user_id']
	let amount = body['amount']
	let note = body['transaction_note']
	let payBy = body['tax-pay-by']

	if (fromUserID === toUserID) {
		return {
			status: false,
			message: 'Không thể tự chuyển cho chính mình',
		}
	}

	if (payBy != 0 && payBy != 1) {
		// 0: Người chuyển - 1: Người nhận chịu phí
		return {
			status: false,
			message: 'Bên chịu phí không hợp lệ',
		}
	}

	if (amount < 10000) {
		// Số tiền giao dịch < 10k
		return {
			status: false,
			message: 'Số tiền chuyển tối thiểu là 10.000',
		}
	}

	// Check số dư
	const user_balance = await digitalWalletRepos.getBalanceByUserID(fromUserID)

	// Số dư hiện tại < tiền chuyển + phí nếu người chuyển chịu phí
	if (payBy == 0 && user_balance[0][0]['balance'] < body['amount'] * (1 + 5 / 100)) {
		return {
			status: false,
			message: 'Số dư không đủ, không thể chuyển.',
		}
	}

	// Số dư hiện tại < tiền chuyển nếu người nhận chịu phí
	if (payBy == 1 && user_balance[0][0]['balance'] < body['amount']) {
		return {
			status: false,
			message: 'Số dư không đủ, không thể chuyển.',
		}
	}

	// Send OTP to mail
	const OTP_Payload = {
		fromUserID,
		toUserID,
		amount,
		note,
		payBy,
		created_at: new Date().getTime(),
	}

	// Tạo data và OTP
	const data = encryptMessage(JSON.stringify(OTP_Payload))

	if (!data.status) {
		return { status: false, message: 'Có lỗi trong quá trình sinh mã OTP ! Vui lòng thử lại sau !' }
	}

	// Khởi tạo mã OTP
	const OTP = userOTPRepos.generateOTP()

	const insertUserOTP = await userOTPRepos.insertUserOTP(fromUserID, OTP, data.encryptedData)

	if (insertUserOTP[0].length < 1) {
		return {
			status: false,
			message: 'Có lỗi xảy ra trong quá trình tạo mã OTP. Vui lòng thử lại sau.',
		}
	}

	const subject = 'OTP Chuyển tiền - Hệ thống ví điện tử'
	const mailContent = `Bạn đã sử dụng chức năng Chuyển tiền. Đây là mã OTP của bạn ${OTP}, Mã OTP chỉ có hiệu lực trong vòng 1 phút!
                        Vui lòng sử dụng trước khi hết hạn!`

	try {
		// const sendMailResult = await sendMail(email, subject, mailContent);
		return {
			status: true,
			message: 'Gửi mã OTP đến mail thành công ! Vui lòng kiểm tra mail để nhận mã OTP',
			OTP: OTP,
		}
	} catch (err) {
		return {
			status: false,
			message: 'Có lỗi trong quá trình gửi thông tin tài khoản đến mail của người dùng ! Vui lòng thử lại sau !',
		}
	}
}

async function verifyOTPTransferMoney(payload, OTP) {
	try {
		// Kiểm tra thông tin user
		const getUserByUsername = await digitalWalletRepos.getUserByUsername(payload.username)
		let getUserByUsernameResult = getUserByUsername[0]

		if (getUserByUsernameResult.length === 0) {
			// Không tồn tại username
			return {
				status: false,
				message: 'Không tìm thấy người dùng. Vui lòng đăng xuất và đăng nhập lại.',
			}
		}
		getUserByUsernameResult = getUserByUsernameResult[0]

		let dataOTP = await userOTPRepos.getUserOTPData(getUserByUsernameResult['user_id'], OTP)
		dataOTP = dataOTP[0]

		if (dataOTP.length < 1) {
			return {
				status: false,
				message: 'Mã OTP không tồn tại. Vui lòng kiểm tra lại.',
			}
		}
		dataOTP = dataOTP[0]

		const verifyOTPResult = decryptMessage(dataOTP['data'])

		if (!verifyOTPResult.status) {
			return { status: false, message: 'Mã OTP không hợp lệ. Vui lòng thử lại' }
		}

		const OTP_payload = JSON.parse(verifyOTPResult.decryptedData)

		if (!OTP_payload.fromUserID || !OTP_payload.toUserID || !OTP_payload.amount || !OTP_payload.created_at) {
			return { status: false, message: 'Mã OTP không hợp lệ ! Vui lòng nhập lại !' }
		}

		const OTP_created_at = new Date(OTP_payload.created_at).getTime()
		const isGreaterThanOneMinute = new Date().getTime() - OTP_created_at >= 60 * 1000

		if (isGreaterThanOneMinute) {
			return {
				status: false,
				message:
					'Mã OTP đã hết hạn ! Vui lòng gửi yêu cầu lấy lại OTP mới ! Hãy nhớ mã OTP chỉ có hiệu lực trong vòng 1 phút !',
			}
		}

		// Check số dư -> 2 lớp -> tránh trường hợp sử dụng lại otp cũ mà tk đã chuyển
		const user_balance = await digitalWalletRepos.getBalanceByUserID(OTP_payload.fromUserID)

		// Số dư hiện tại < tiền chuyển + phí nếu người chuyển chịu phí
		if (OTP_payload.payBy == 0 && user_balance[0][0]['balance'] < OTP_payload.amount * (1 + 5 / 100)) {
			return {
				status: false,
				message: 'Số dư không đủ, không thể chuyển.',
			}
		}

		// Số dư hiện tại < tiền chuyển nếu người nhận chịu phí
		if (OTP_payload.payBy == 1 && user_balance[0][0]['balance'] < OTP_payload.amount) {
			return {
				status: false,
				message: 'Số dư không đủ, không thể chuyển.',
			}
		}

		// Tiến hành chuyển tiền sang tài khoản
		const transferMoney = await digitalWalletRepos.transferMoney(
			OTP_payload.fromUserID,
			OTP_payload.toUserID,
			parseInt(OTP_payload.amount),
			OTP_payload.payBy,
		)
		let transferMoneyResult = transferMoney

		if (OTP_payload.amount > 5000000) {
			// Có lỗi xảy ra
			if (transferMoneyResult.affectedRows === 0) {
				return {
					status: false,
					message: 'Chuyển tiền thất bại. Vui lòng thử lại sau.',
				}
			}

			return {
				status: false,
				message: 'Yêu cầu chuyển tiền nhiều hơn 5000000 đã được gửi. Vui lòng chờ admin xử lý giao dịch.',
			}
		}

		// Có lỗi xảy ra
		if (
			transferMoneyResult[0].affectedRows === 0 ||
			transferMoneyResult[1].affectedRows === 0 ||
			transferMoneyResult[2].affectedRows === 0
		) {
			return {
				status: false,
				message: 'Chuyển tiền thất bại. Vui lòng thử lại sau.',
			}
		}

		const toUser_balance = await digitalWalletRepos.getBalanceByUserID(OTP_payload.toUserID)
		const fromUser = await digitalWalletRepos.getUserByUserID(OTP_payload.fromUserID)

		const date = new Date(OTP_payload.created_at)
		let dateString =
			date.getHours() +
			':' +
			date.getMinutes() +
			':' +
			date.getSeconds() +
			', ' +
			date.getDate() +
			'/' +
			(date.getMonth() + 1) +
			'/' +
			date.getFullYear()

		// Gửi mail cho người nhận tiền
		const subject = 'Thông báo nhận tiền'
		const mailContent = `Vào lúc ${dateString},\nTài khoản của bạn nhận được số tiền ${OTP_payload.amount} từ ${fromUser[0][0]['phone_number']}.\nSố dư mới: ${toUser_balance[0][0]['balance']}`

		//const sendMailResult = await sendMail(email, subject, mailContent);

		return { status: true, message: 'Chuyển tiền thành công.' }
	} catch (err) {
		return { status: false, message: 'Có lỗi xảy ra. Vui lòng thử lại sau.', err: err.message }
	}
}

// Mua mã thẻ điện thoại
async function servicePayment(payload, body) {
	const phone_card_values = [10000, 20000, 50000, 100000]

	// Lấy thông tin user
	let userInformation = await digitalWalletRepos.getUserByUsername(payload.username)
	userInformation = userInformation[0]

	if (userInformation.length < 1) {
		return {
			status: false,
			message: 'Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.',
		}
	}
	userInformation = userInformation[0]

	const getNetworkOperatorByName = await digitalWalletRepos.getNetworkOperatorByName(body['network-operator-name'])
	let network_operator = getNetworkOperatorByName[0]

	if (network_operator.length < 1) {
		return {
			status: false,
			message: 'Nhà mạng ' + body['network-operator-name'] + ' không được hỗ trợ.',
		}
	}
	network_operator = network_operator[0]

	// Validate 2 lớp
	if (body['phone-card-quantity'] > 5 || body['phone-card-quantity'] < 1) {
		return {
			status: false,
			message: 'Chỉ được mua từ 1-5 thẻ mỗi giao dịch',
		}
	}

	if (!phone_card_values.find((value) => value == body['phone-card-value'])) {
		return {
			status: false,
			message: 'Mệnh giá thẻ nạp không được hỗ trợ. Vui lòng chọn mệnh giá khác.',
		}
	}

	// Check số dư
	const user_balance = await digitalWalletRepos.getBalanceByUserID(userInformation['user_id'])

	// Số dư hiện tại < tổng tiền mua thẻ
	if (user_balance[0][0]['balance'] < body['phone-card-value'] * body['phone-card-quantity']) {
		return {
			status: false,
			message: 'Số dư không đủ. Vui lòng kiểm tra lại',
		}
	}

	// Mua thẻ nạp -> Tạo một thẻ mới + Thêm lịch sử giao dịch + Thanh toán tk user
	const result = await digitalWalletRepos.payPhoneCardService(
		userInformation['user_id'],
		network_operator['network_operator_code'],
		body['phone-card-value'],
		body['phone-card-quantity'],
	)

	if (
		result.result[0].affectedRows < 1 ||
		result.result[1].affectedRows < body['phone-card-quantity'] ||
		result.result[2].affectedRows < 1
	) {
		return {
			status: false,
			message: 'Có lỗi xảy ra. Vui lòng thử lại.',
		}
	}

	return {
		status: true,
		message: 'Thanh toán dịch vụ mua thẻ điện thoại thành công',
		data: result.note,
	}
}

async function transferHistory(payload, transaction_id) {
	let userInformation = await digitalWalletRepos.getUserByUsername(payload.username)
	userInformation = userInformation[0]

	if (userInformation.length < 1) {
		return {
			status: false,
			message: 'Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.',
		}
	}
	userInformation = userInformation[0]

	// Get tất cả lịch sử giao dịch liên quan user
	if (!transaction_id) {
		const transferHistoryResult = await digitalWalletRepos.getAllTransferHistory(userInformation['user_id'])

		if (transferHistoryResult[0].length < 1) {
			return {
				status: false,
				message: 'Không tìm thấy lịch sử giao dịch. Vui lòng kiểm tra lại.',
			}
		}
		let transferHistoryData = transferHistoryResult[0]

		return {
			status: true,
			message: 'Lấy danh sách lịch sử giao dịch thành công.',
			data: transferHistoryData,
		}
	}

	const transferHistoryResult = await digitalWalletRepos.getTransferHistoryByID(
		userInformation['user_id'],
		transaction_id,
	)

	if (transferHistoryResult[0].length < 1) {
		return {
			status: false,
			message: 'Không tìm thấy lịch sử giao dịch. Vui lòng kiểm tra lại.',
		}
	}
	let transferHistoryData = transferHistoryResult[0][0]

	if (transferHistoryData['transaction_type'] === DB_CONSTANTS.TRANSACTION_TYPE_TRANSFER_MONEY) {
		// Chỉ lấy chi tiết 1 giao dịch by transaction_id
		let fromUserInfo = await digitalWalletRepos.getUserByUserID(transferHistoryData['send_from'])
		fromUserInfo = fromUserInfo[0]

		transferHistoryData['send_from'] =
			fromUserInfo.length < 1
				? 'Người này đã bị xóa khỏi hệ thống'
				: fromUserInfo.map((user) => {
						return {
							user_id: user['user_id'],
							phone_number: user['phone_number'],
							email: user['email'],
							full_name: user['full_name'],
						}
				  })[0]

		let toUserInfo = await digitalWalletRepos.getUserByUserID(transferHistoryData['send_to'])
		toUserInfo = toUserInfo[0]

		transferHistoryData['send_to'] =
			toUserInfo.length < 1
				? 'Người này đã bị xóa khỏi hệ thống'
				: toUserInfo.map((user) => {
						return {
							user_id: user['user_id'],
							phone_number: user['phone_number'],
							email: user['email'],
							full_name: user['full_name'],
						}
				  })[0]
	}

	return {
		status: true,
		message: 'Lấy thông tin lịch sử giao dịch thành công.',
		data: transferHistoryData,
	}
}

async function findUserByPhone(phone_number) {
	if (!phone_number) {
		return {
			status: false,
			message: 'Không tìm thấy số điện thoại nào.',
		}
	}

	// Thông tin người nhận
	const getUserByPhoneNumber = await digitalWalletRepos.getUserByPhoneNumber(phone_number)

	let getUserByPhoneNumberResult = getUserByPhoneNumber[0]

	if (getUserByPhoneNumberResult.length < 1) {
		// Không tìm thấy người nhận nào với sđt này
		return {
			status: false,
			message: 'Không tìm thấy thông tin người nhận. Vui lòng kiểm tra lại.',
		}
	}

	return {
		status: true,
		message: 'Thông tin User',
		data: getUserByPhoneNumberResult.map((user) => {
			return {
				user_id: user['user_id'],
				full_name: user['full_name'],
				email: user['email'],
			}
		})[0],
	}
}

module.exports = {
	validateRechargeMoney,
	rechargeMoneyFromCreditCard,
	withdrawMoney,
	transferMoney,
	verifyOTPTransferMoney,
	servicePayment,
	transferHistory,
	findUserByPhone,
}
