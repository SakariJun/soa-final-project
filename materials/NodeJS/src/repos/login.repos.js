const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const { pool } = require('../configs/database');
const mysql = require('mysql2');

async function getAccountByUsername(username) {
    let sql_validate_login = "SELECT * FROM ?? WHERE ?? = ?";
    let inserts = [
        "account",
        "username",
        username
    ];
    sql_validate_login = mysql.format(sql_validate_login, inserts);

    return await pool.promise().query(sql_validate_login);
}

async function updateLoginFailedAttemptWithoutBannedAccount(username, login_failed_attempt) {
    let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let inserts = [
        "account",
        "login_failed_attempt",
        login_failed_attempt + 1,
        "username",
        username
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function updateLoginFailedAttemptAndBannedAccount(username, login_failed_attempt) {
    let sql = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
    let inserts = [
        "account",
        "login_failed_attempt",
        login_failed_attempt + 1,
        "last_lock_time",
        new Date(),
        "is_banned",
        DB_CONSTANTS.ACCOUNT_IS_BANNED,
        "banned_date",
        new Date(),
        "username",
        username
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

async function updateRefreshTokenAndResetLoginAttemptFailedByUsername(username, refreshToken) {
    let sql = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
    let insert = [
        "account",
        "login_failed_attempt",
        0,
        "refresh_token",
        refreshToken,
        "is_banned",
        DB_CONSTANTS.ACCOUNT_NOT_BANNED,
        "username",
        username
    ];
    sql = mysql.format(sql, insert);

    return await pool.promise().query(sql);
}

module.exports = {
    getAccountByUsername,
    updateLoginFailedAttemptWithoutBannedAccount,
    updateLoginFailedAttemptAndBannedAccount,
    updateRefreshTokenAndResetLoginAttemptFailedByUsername,
}