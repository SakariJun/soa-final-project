const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const { pool } = require('../configs/database');
const mysql = require('mysql2');

async function getUserAccountsByState(state) {
    let sql = "SELECT * FROM ?? " +
        "JOIN ?? ON account.account_id = user.user_account_id " +
        "JOIN ?? ON user.user_wallet_id = user_digital_wallet.user_digital_wallet_id " +
        "WHERE account.state = ? " +
        "ORDER BY ?? DESC";
    let inserts = [
        "account",
        "user",
        "user_digital_wallet",
        state,
        "created_date",
    ];

    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function getBannedUserAccounts() {
    let sql = "SELECT * FROM ?? " +
        "JOIN ?? ON account.account_id = user.user_account_id " +
        "JOIN ?? ON user.user_wallet_id = user_digital_wallet.user_digital_wallet_id " +
        "WHERE account.is_banned = ? " +
        "ORDER BY ?? DESC";
    let inserts = [
        "account",
        "user",
        "user_digital_wallet",
        DB_CONSTANTS.ACCOUNT_IS_BANNED,
        "banned_date",
    ];


    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function updateUserAccountState(username, state) {
    let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let inserts = [
        "account",
        "state",
        state,
        "username",
        username,
    ];

    sql = mysql.format(sql, inserts);
    return await pool.promise().query(sql);
}

async function unbannedAccount(username) {
    let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let inserts = [
        "account",
        "is_banned",
        DB_CONSTANTS.ACCOUNT_NOT_BANNED,
        "username",
        username,
    ];

    sql = mysql.format(sql, inserts);
    return await pool.promise().query(sql);
}

module.exports = {
    getUserAccountsByState,
    getBannedUserAccounts,
    updateUserAccountState,
    unbannedAccount
}