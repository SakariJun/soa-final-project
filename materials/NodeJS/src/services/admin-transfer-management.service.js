const adminTransfertManagementRepos = require('../repos/admin-transfer-management.repos');
const { validationResult } = require('express-validator');
const DB_CONSTANTS = require('../utils/database-constant-number.utils');

async function getWaitingTransfer(id) {

    if (!id) {
        waitingTransfer = await adminTransfertManagementRepos.getAllWaitingTransfer();
    } else {
        waitingTransfer = await adminTransfertManagementRepos.getWaitingTransfer(id)
        waitingTransfer = waitingTransfer[0]

        // Chỉ trường hợp chuyển tiền giữa 2 users -> các trường hợp khác không cần hiển thị tên người chuyển / nhận
        if (waitingTransfer.length > 0 && waitingTransfer[0]['transaction_type'] === DB_CONSTANTS.TRANSACTION_TYPE_TRANSFER_MONEY) {
            // Lấy thông tin chi tiết users
            let fromUserInfo = await adminTransfertManagementRepos.getUserByUserID(waitingTransfer[0]['send_from'])
            fromUserInfo = fromUserInfo[0]

            waitingTransfer[0]['send_from'] = fromUserInfo.length < 1 ? "Người này đã bị xóa khỏi hệ thống" : fromUserInfo.map(user => {
                return {
                    user_id: user['user_id'],
                    phone_number: user['phone_number'],
                    email: user['email'],
                    full_name: user['full_name']
                }
            })[0]

            let toUserInfo = await adminTransfertManagementRepos.getUserByUserID(waitingTransfer[0]['send_to'])
            toUserInfo = toUserInfo[0]

            waitingTransfer[0]['send_to'] = toUserInfo.length < 1 ? "Người này đã bị xóa khỏi hệ thống" : toUserInfo.map(user => {
                return {
                    user_id: user['user_id'],
                    phone_number: user['phone_number'],
                    email: user['email'],
                    full_name: user['full_name']
                }
            })[0]
        }
    }

    if (waitingTransfer.length < 1) {
        return {
            status: false,
            message: "Không tìm thấy giao dịch nào"
        }
    }

    // Trả về transaction(s) đang chờ duyệt
    return {
        status: true,
        message: "Danh sách giao dịch đang chờ duyệt",
        data: waitingTransfer[0]
    }
}

// Lấy danh sách toàn bộ giao dịch của user id 
async function getWaitingTransferByUser(user_id) {

    if (!user_id) {
        return {
            status: false,
            message: "Không tìm thấy user id"
        }
    }

    const waitingTransfer = await adminTransfertManagementRepos.getAllWaitingTransferByUserID(user_id);

    if (waitingTransfer[0].length < 1) {
        return {
            status: false,
            message: "Không tìm thấy giao dịch nào"
        }
    }

    // Trả về transaction(s) đang chờ duyệt của user này
    return {
        status: true,
        message: "Danh sách giao dịch đang chờ duyệt",
        data: waitingTransfer[0]
    }
}

async function getMonthlyTransferByUser(user_id) {

    if (!user_id) {
        return {
            status: false,
            message: "Không tìm thấy user id"
        }
    }

    const monthlyTransfer = await adminTransfertManagementRepos.getMonthlyTransferByUserID(user_id);

    if (monthlyTransfer[0].length < 1) {
        return {
            status: false,
            message: "Không tìm thấy giao dịch nào trong tháng"
        }
    }

    // Trả về transaction(s) trong tháng hiện tại
    return {
        status: true,
        message: "Danh sách giao dịch trong tháng",
        data: monthlyTransfer[0]
    }
}

// Update giao dịch Thành công / hủy
async function updateTransferState(transaction, transaction_state) {

    if (transaction['transaction_type'] === DB_CONSTANTS.TRANSACTION_TYPE_TRANSFER_MONEY) {
        transaction['phone_number'] = transaction['send_from']['phone_number']
        transaction['send_to'] = (transaction['send_to']['user_id']) ? transaction['send_to']['user_id'] : transaction['send_to']
        transaction['send_from'] = (transaction['send_from']['user_id']) ? transaction['send_from']['user_id'] : transaction['send_from']
    }

    // Hủy yêu cầu giao dịch
    if (transaction_state == "reject") {
        transaction['transaction_state'] = DB_CONSTANTS.TRANSACTION_STATE_FAIL

        const rejectWaitingTransferResult = await adminTransfertManagementRepos.updateTransferState(transaction)

        if (rejectWaitingTransferResult[0].length < 1) {
            return {
                status: false,
                message: "Có lỗi xảy ra. Vui lòng thử lại sau."
            }
        }

        return {
            status: true,
            message: "Hủy yêu cầu giao dịch thành công."
        }
    }

    // Approve yêu cầu
    transaction['transaction_state'] = DB_CONSTANTS.TRANSACTION_STATE_SUCCESS

    // Check số dư
    const user_balance = await adminTransfertManagementRepos.getBalanceByUserID(transaction['send_from'])

    if (user_balance[0].length < 1) {
        return {
            status: false,
            message: "Bên chuyển không còn sử dụng hệ thống. Không thể xử lý giao dịch này."
        }
    }

    // Số dư hiện tại kh đủ
    if ((transaction['transaction_tax_pay_by'] === 0 && user_balance[0][0]['balance'] < transaction['amount'] + transaction['transaction_tax']) ||
        user_balance[0][0]['balance'] < transaction['amount']) {
        return {
            status: false,
            message: "Số dư của bên chuyển hiện tại không đủ. Không thể xử lý giao dịch này."
        }
    }

    // Validate xong -> update giao dịch + số dư user
    const updateWaitingTransfer = await adminTransfertManagementRepos.updateTransferState(transaction)

    if (updateWaitingTransfer[0].length < 1) {
        return {
            status: false,
            message: "Có lỗi xảy ra. Vui lòng thử lại sau."
        }
    }

    if (transaction['send_to']) {
        const date = new Date()
        let dateString = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ", " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()

        // Check số dư ng nhận
        const new_balance = await adminTransfertManagementRepos.getBalanceByUserID(transaction['send_to'])

        // Gửi mail cho người nhận tiền
        const subject = "Thông báo nhận tiền";
        const mailContent = `Vào lúc ${dateString},\nTài khoản của bạn nhận được số tiền ${transaction['amount']} từ ${transaction['phone_number']}.\nSố dư mới: ${new_balance[0][0]['balance']}`;

        console.log(mailContent)
            //const sendMailResult = await sendMail(email, subject, mailContent);
    }

    return {
        status: true,
        message: "Giải quyết giao dịch thành công."
    }
}

module.exports = {
    getWaitingTransfer,
    updateTransferState,
    getWaitingTransferByUser,
    getMonthlyTransferByUser
}