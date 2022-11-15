const { prepareStatement, pool } = require('../configs/database')
const mysql = require('mysql2');

async function insertUserInformation({
    phone_number,
    email,
    full_name,
    day_of_birth,
    address,
    identity_card_front,
    identity_card_back,
    user_account_id,
    user_wallet_id,
}) {
    const result = await prepareStatement(
        `INSERT INTO user(phone_number, email, full_name, day_of_birth, address, identity_card_front, identity_card_back, user_account_id, user_wallet_id) VALUES(?,?,?,?,?,?,?,?,?)`, [
            phone_number,
            email,
            full_name,
            day_of_birth,
            address,
            identity_card_front,
            identity_card_back,
            user_account_id,
            user_wallet_id,
        ],
    )

    return {
        status: true,
        id: result,
    }
}

async function insertAccount(username, password) {
    const result = await prepareStatement(`INSERT INTO account(username, password) VALUES(?,?)`, [
        username,
        password,
    ])

    return {
        status: true,
        id: result.insertId,
    }
}

async function insertDigitalWallet() {
    const result = await prepareStatement(`INSERT INTO user_digital_wallet VALUES()`);

    return {
        status: true,
        id: result.insertId,
    }
}

async function insertOTPData(user_id) {
    return await prepareStatement(`INSERT INTO user_otp (user_id) VALUES(${user_id})`);
}

async function isExistEmailOrPhone(email, phone_number) {
    let sql_check_is_exists_email = "SELECT ?? FROM ?? WHERE ?? = ?";
    let inserts_is_exists_email = ["email", "user", "email", email];
    sql_check_is_exists_email = mysql.format(
        sql_check_is_exists_email,
        inserts_is_exists_email
    );

    let sql_check_is_exists_phone_number = "SELECT ?? FROM ?? WHERE ?? = ?";
    let inserts_is_exists__phone_number = [
        "phone_number",
        "user",
        "phone_number",
        phone_number,
    ];
    sql_check_is_exists_phone_number = mysql.format(
        sql_check_is_exists_phone_number,
        inserts_is_exists__phone_number
    );

    try {
        const result = await Promise.all([
            pool.promise().query(sql_check_is_exists_email),
            pool.promise().query(sql_check_is_exists_phone_number),
        ]);

        return { status: true, result }
    } catch (err) {
        return { status: false, message: err.message };
    }
}

async function getMaxID() {
    let sql = "SELECT MAX(account_id) FROM `account`";
    return await prepareStatement(sql);
}

module.exports = {
    insertUserInformation,
    insertAccount,
    insertDigitalWallet,
    isExistEmailOrPhone,
    getMaxID,
    insertOTPData
}