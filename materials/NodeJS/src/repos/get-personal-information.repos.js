const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const { pool } = require('../configs/database');
const mysql = require('mysql2');

async function getPersonalInformation(username) {
    let sql = "SELECT * FROM ?? " +
        "JOIN ?? ON account.account_id = user.user_account_id " +
        "JOIN ?? ON user.user_wallet_id = user_digital_wallet.user_digital_wallet_id " +
        "WHERE account.username = ?";
    let inserts = [
        "account",
        "user",
        "user_digital_wallet",
        username,
    ];

    sql = mysql.format(sql, inserts);

    console.log(sql);
    return await pool.promise().query(sql);
}

async function getAccountRoleByUsername(username) {
    let sql = "SELECT role FROM ?? WHERE ?? = ?";
    let inserts = [
        "account",
        "username",
        username,
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

module.exports = { getPersonalInformation, getAccountRoleByUsername }