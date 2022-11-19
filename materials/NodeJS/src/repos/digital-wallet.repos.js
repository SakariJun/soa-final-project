const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const { pool } = require('../configs/database');
const mysql = require('mysql2');

async function getCreditCardByCardNumber(card_number) {
    let sql = "SELECT * FROM ?? WHERE ?? = ?"
    let inserts = [
        "credit_card",
        "card_number",
        card_number,
    ];


    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function getUserIDByUsername(username) {
    let sql = "SELECT ?? FROM ?? JOIN ?? ON user.user_id = account.account_id WHERE ?? = ?";
    let inserts = [
        "user_id",
        "user",
        "account",
        "username",
        username
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function rechargeMoney(user_id, recharge_amount) {
    let sql_create_new_transaction = "INSERT INTO ?? (??, ??, ??, ??) VALUES(?, ?, ?, ?)"
    let inserts_create_new_transaction = [
        "transaction",
        "send_to",
        "amount",
        "transaction_type",
        "transaction_state",
        user_id,
        recharge_amount,
        DB_CONSTANTS.TRANSACTION_TYPE_RECHARGE_MONEY,
        DB_CONSTANTS.TRANSACTION_STATE_SUCCESS,
    ];
    sql_create_new_transaction = mysql.format(sql_create_new_transaction, inserts_create_new_transaction);

    let sql_update_user_balance = `UPDATE ?? 
                                    JOIN ?? ON user_digital_wallet.user_digital_wallet_id = user.user_wallet_id
                                    SET ?? = ?? + ?
                                    WHERE user.user_id = ?`
    let inserts_update_user_balance = [
        "user_digital_wallet",
        "user",
        "balance",
        "balance",
        recharge_amount,
        user_id,
    ];
    sql_update_user_balance = mysql.format(sql_update_user_balance, inserts_update_user_balance);

    return await Promise.all([pool.promise().query(sql_create_new_transaction), pool.promise().query(sql_update_user_balance)]);
}

async function getWithdrawTimesByDate(user_id, day, month, year) {
    let sql = `SELECT COUNT(*) AS ?? FROM ?? WHERE ?? = ? 
                AND DAY(transaction_time) = ? 
                AND MONTH(transaction_time) = ? 
                AND YEAR(transaction_time) = ?
                AND send_to IS NULL`; // Rút về thẻ không có ID người nhận

    let inserts = [
        "Total",
        "transaction",
        "send_from",
        user_id,
        day,
        month,
        year
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function withdrawMoney(user_id, amount) {

    let transaction_state = amount > 5000000 ? DB_CONSTANTS.TRANSACTION_STATE_WAITING : DB_CONSTANTS.TRANSACTION_STATE_SUCCESS;
    let transaction_tax = 5 * amount / 100;

    let sql_create_new_transaction = "INSERT INTO ?? (??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?)"
    let inserts_create_new_transaction = [
        "transaction",
        "send_from",
        "transaction_type",
        "amount",
        "transaction_state",
        "transaction_tax",
        user_id,
        DB_CONSTANTS.TRANSACTION_TYPE_WITHDRAW_MONEY,
        amount,
        transaction_state,
        transaction_tax
    ];
    sql_create_new_transaction = mysql.format(sql_create_new_transaction, inserts_create_new_transaction);

    if (amount > 5000000) {
        return await pool.promise().query(sql_create_new_transaction);
    }

    // Ít hơn or bằng 5m mới xử lý balance
    let sql_update_user_balance = `UPDATE ?? 
                                    JOIN ?? ON user_digital_wallet.user_digital_wallet_id = user.user_wallet_id
                                    SET ?? = ?? - ?, last_withdraw = CURRENT_TIMESTAMP()
                                    WHERE user.user_id = ?`
    let inserts_update_user_balance = [
        "user_digital_wallet",
        "user",
        "balance",
        "balance",
        amount + transaction_tax,
        user_id,
    ];
    sql_update_user_balance = mysql.format(sql_update_user_balance, inserts_update_user_balance);

    return await Promise.all([pool.promise().query(sql_create_new_transaction), pool.promise().query(sql_update_user_balance)]);
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

async function getUserByPhoneNumber(phone_number) {
    let sql = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = [
        "user",
        "phone_number",
        phone_number
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

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

async function getUserByUsername(username) {
    let sql = "SELECT * FROM ?? JOIN ?? ON user.user_id = account.account_id WHERE ?? = ?";
    let inserts = [
        "user",
        "account",
        "username",
        username
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function transferMoney(from_user, to_user, amount, payBy) {

    let transaction_state = amount > 5000000 ? DB_CONSTANTS.TRANSACTION_STATE_WAITING : DB_CONSTANTS.TRANSACTION_STATE_SUCCESS;
    let transaction_tax = 5 * amount / 100;

    let sql_create_new_transaction = "INSERT INTO ?? (??, ??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?, ?)"
    let inserts_create_new_transaction = [
        "transaction",
        "send_from",
        "send_to",
        "transaction_type",
        "amount",
        "transaction_state",
        "transaction_tax",
        "transaction_tax_pay_by",
        from_user,
        to_user,
        DB_CONSTANTS.TRANSACTION_TYPE_TRANSFER_MONEY,
        amount,
        transaction_state,
        transaction_tax,
        payBy
    ];
    sql_create_new_transaction = mysql.format(sql_create_new_transaction, inserts_create_new_transaction);

    // Tạo lịch sử giao dịch -> và tạm dừng để chờ admin duyệt
    if (amount > 5000000) {
        return await pool.promise().query(sql_create_new_transaction);
    }

    if (payBy == 1) {
        // Người nhận chịu phí -> trừ vào tiền chuyển
        amount = amount - transaction_tax
    }

    // Update balance khi giao dịch <5m
    let sql_update_fromUser_balance = `UPDATE ?? 
                                    JOIN ?? ON user_digital_wallet.user_digital_wallet_id = user.user_wallet_id
                                    SET ?? = ?? - ?
                                    WHERE user.user_id = ?`
    let inserts_update_fromUser_balance = [
        "user_digital_wallet",
        "user",
        "balance",
        "balance",
        amount + transaction_tax, // Nếu đã - tax thì + lại tax = tiền gốc. Ngược lại thì = gốc + phí
        from_user,
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
        amount,
        to_user,
    ];
    sql_update_toUser_balance = mysql.format(sql_update_toUser_balance, inserts_update_toUser_balance);

    return await Promise.all([pool.promise().query(sql_create_new_transaction), pool.promise().query(sql_update_fromUser_balance), pool.promise().query(sql_update_toUser_balance)]);
}

// Lấy mã nhà mạng từ tên nhà mạng
async function getNetworkOperatorByName(network_operator_name) {
    let sql = "SELECT * FROM ?? WHERE ?? = ?"
    let inserts = [
        "mobile_network_operator",
        "network_operator_name",
        network_operator_name
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function getNewPhoneCardID(network_operator_code, phone_card_quantity) {
    let sql = "SELECT * FROM ?? WHERE ?? LIKE ? ORDER BY phone_card_id DESC LIMIT 1"
    let inserts = [
        "phone_card",
        "phone_card_id",
        network_operator_code + "%"
    ];
    sql = mysql.format(sql, inserts);

    let getPhoneCardIDResult = await pool.promise().query(sql);
    getPhoneCardIDResult = getPhoneCardIDResult[0]

    let current_id = 0;
    if (getPhoneCardIDResult.length > 0) {
        // lấy id thẻ = 5 số cuối
        current_id = parseInt(getPhoneCardIDResult[0]['phone_card_id'].substring(5))
    }

    let phone_card_id_list = []
    for (let i = 1; i <= phone_card_quantity; i++) {
        phone_card_id_list.push(network_operator_code + String(current_id + i).padStart(5, '0'))
    }

    return phone_card_id_list
}

// Tạo một mã thẻ mới từ code nhà mạng
function createPhoneCard(phone_card_id_list, phone_card_value) {
    let sql = "INSERT INTO ?? (??, ??) VALUES(?, ?)"
    let inserts = [
        "phone_card",
        "phone_card_id",
        "phone_card_value",
        phone_card_id_list[0],
        phone_card_value
    ];

    for (let i = 1; i < phone_card_id_list.length; i++) {
        sql += ", (?, ?)"
        inserts.push(phone_card_id_list[i])
        inserts.push(phone_card_value)
    }

    return mysql.format(sql, inserts);
}

async function payPhoneCardService(user_id, network_operator_code, phone_card_value, phone_card_quantity) {

    // tạo một mã thẻ mới
    const phone_card_id_list = await getNewPhoneCardID(network_operator_code, phone_card_quantity)
    const sql_create_phone_cards = createPhoneCard(phone_card_id_list, phone_card_value)

    transaction_note = "Số thẻ: " + phone_card_quantity + "\nMệnh giá: " + phone_card_value
    phone_card_id_list.forEach(phone_card_id => {
        transaction_note += "\nMã thẻ: " + phone_card_id
    })

    // Tạo transaction
    let sql_create_new_transaction = "INSERT INTO ?? (??, ??, ??, ??, ??, ??) VALUES(?, ?, ?, ?, ?, ?)"
    let inserts_create_new_transaction = [
        "transaction",
        "send_from",
        "transaction_type",
        "amount",
        "transaction_state",
        "transaction_note",
        "transaction_tax",
        user_id,
        DB_CONSTANTS.TRANSACTION_TYPE_SERVICE_PAYMENT,
        phone_card_value * phone_card_quantity,
        DB_CONSTANTS.TRANSACTION_STATE_SUCCESS,
        transaction_note,
        0
    ];
    sql_create_new_transaction = mysql.format(sql_create_new_transaction, inserts_create_new_transaction);

    // Update balance khi giao dịch <5m
    let sql_update_user_balance = `UPDATE ?? 
        JOIN ?? ON user_digital_wallet.user_digital_wallet_id = user.user_wallet_id
        SET ?? = ?? - ?
        WHERE user.user_id = ?`

    let inserts_update_user_balance = [
        "user_digital_wallet",
        "user",
        "balance",
        "balance",
        phone_card_value * phone_card_quantity,
        user_id,
    ];
    sql_update_user_balance = mysql.format(sql_update_user_balance, inserts_update_user_balance);

    return {
        result: await Promise.all([
            pool.promise().query(sql_create_new_transaction),
            pool.promise().query(sql_create_phone_cards),
            pool.promise().query(sql_update_user_balance)
        ]),
        note: transaction_note
    }
}

async function getTransferHistoryByID(user_id, transaction_id) {
    // Đối với người nhận, chỉ STATE SUCCESS mới được check
    let sql = "SELECT * FROM ?? WHERE (?? = ?) OR (?? = ? AND ?? = ?) AND ?? = ?"
    let inserts = [
        "transaction",
        "send_from",
        user_id,
        "send_to",
        user_id,
        "transaction_state",
        DB_CONSTANTS.TRANSACTION_STATE_SUCCESS,
        "transaction_id",
        transaction_id
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function getAllTransferHistory(user_id) {
    // Chỉ hiển thị lịch sử GỬI / ĐANG GỬI / ĐÃ HỦY / ĐÃ NHẬN 
    // ( Giao dịch nhận chưa hoàn thành / hủy không hiển thị)
    let sql = "SELECT * FROM ?? WHERE (?? = ?) OR (?? = ? AND ?? = ?) ORDER BY ?? DESC"
    let inserts = [
        "transaction",
        "send_from",
        user_id,
        "send_to",
        user_id,
        "transaction_state",
        DB_CONSTANTS.TRANSACTION_STATE_SUCCESS,
        "transaction_time"
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

module.exports = {
    getCreditCardByCardNumber,
    rechargeMoney,
    getUserIDByUsername,
    getWithdrawTimesByDate,
    withdrawMoney,
    getBalanceByUserID,
    getUserByUsername,
    getUserByUserID,
    getUserByPhoneNumber,
    transferMoney,
    getNetworkOperatorByName,
    payPhoneCardService,
    getTransferHistoryByID,
    getAllTransferHistory
}