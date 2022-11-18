const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const { pool } = require('../configs/database');
const mysql = require('mysql2');

async function getUserByUserID(user_id) {
    let sql = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = [
        "user",
        "user_id",
        user_id
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function getAllWaitingTransfer() {
    // Chỉ hiển thị những giao dịch đang chờ duyệt
    let sql = "SELECT * FROM ?? WHERE ?? = ? ORDER BY ?? DESC"
    let inserts = [
        "transaction",
        "transaction_state",
        DB_CONSTANTS.TRANSACTION_STATE_WAITING,
        "transaction_time"
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function getMonthlyTransferByUserID(user_id) {
    // Hiển thị toàn bộ giao dịch của user trong tháng hiện tại
    // Trừ các giao dịch là bên nhận nhưng chưa được duyệt
    let month = new Date().getMonth() + 1;

    let sql = "SELECT * FROM ?? WHERE ((?? = ? AND ?? = ?) OR ?? = ?) AND MONTH(??) = ? ORDER BY ?? DESC"
    let inserts = [
        "transaction",
        "transaction_state",
        DB_CONSTANTS.TRANSACTION_STATE_SUCCESS,
        "send_to",
        user_id,
        "send_from",
        user_id,
        "transaction_time",
        month,
        "transaction_time"
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function getAllWaitingTransferByUserID(user_id) {
    // Chỉ hiển thị những giao dịch đang chờ duyệt của user id này
    let sql = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ? ORDER BY ?? DESC"
    let inserts = [
        "transaction",
        "transaction_state",
        DB_CONSTANTS.TRANSACTION_STATE_WAITING,
        "send_from",
        user_id,
        "transaction_time"
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function getWaitingTransfer(transaction_id) {
    // Chỉ được xem giao dịch đang chờ duyệt.
    let sql = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?"
    let inserts = [
        "transaction",
        "transaction_state",
        DB_CONSTANTS.TRANSACTION_STATE_WAITING,
        "transaction_id",
        transaction_id
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function updateTransferState(transaction) {
    let sql_update_transaction_state = `UPDATE ?? SET ?? = ? WHERE ?? = ?`;
    let inserts_update_transaction_state = [
        "transaction",
        "transaction_state",
        transaction['transaction_state'],
        "transaction_id",
        transaction['transaction_id'],
    ];
    sql_update_transaction_state = mysql.format(sql_update_transaction_state, inserts_update_transaction_state);

    // Không cập nhật số dư nếu hủy giao dịch
    if (transaction['transaction_state'] === DB_CONSTANTS.TRANSACTION_STATE_FAIL) {
        return await pool.promise().query(sql_update_transaction_state);
    }

    if (transaction['transaction_tax_pay_by'] === 1) {
        transaction['amount'] = transaction['amount'] - transaction['transaction_tax']
    }

    let sql_update_fromUser_balance = `UPDATE ?? 
        JOIN ?? ON user_digital_wallet.user_digital_wallet_id = user.user_wallet_id
        SET ?? = ?? - ?
        WHERE user.user_id = ?`
    let inserts_update_fromUser_balance = [
        "user_digital_wallet",
        "user",
        "balance",
        "balance",
        transaction['amount'] + transaction['transaction_tax'], // Nếu đã - tax thì + lại tax = tiền gốc. Ngược lại thì = gốc + phí
        transaction['send_from'],
    ];
    sql_update_fromUser_balance = mysql.format(sql_update_fromUser_balance, inserts_update_fromUser_balance);

    let sql_update_toUser_balance = `UPDATE ?? 
        JOIN ?? ON user_digital_wallet.user_digital_wallet_id = user.user_wallet_id
        SET ?? = ?? + ?
        WHERE user.user_id = ?`

    let inserts_update_toUser_balance = [
        "user_digital_wallet",
        "user",
        "balance",
        "balance",
        transaction['amount'],
        transaction['send_to'],
    ];
    sql_update_toUser_balance = mysql.format(sql_update_toUser_balance, inserts_update_toUser_balance);

    return await Promise.all([pool.promise().query(sql_update_transaction_state), pool.promise().query(sql_update_fromUser_balance), pool.promise().query(sql_update_toUser_balance)]);
}

async function getBalanceByUserID(user_id) {
    let sql = "SELECT * FROM ?? JOIN ?? ON user.user_wallet_id = user_digital_wallet.user_digital_wallet_id WHERE ?? = ?";
    let inserts = [
        "user_digital_wallet",
        "user",
        "user_id",
        user_id
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

module.exports = {
    getUserByUserID,
    getAllWaitingTransfer,
    getWaitingTransfer,
    updateTransferState,
    getBalanceByUserID,
    getAllWaitingTransferByUserID,
    getMonthlyTransferByUserID
}