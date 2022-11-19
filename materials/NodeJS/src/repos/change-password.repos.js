const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const { pool } = require('../configs/database');
const mysql = require('mysql2');

async function changePassword(username, hashedPassword, refreshToken) {
    let sql = "";
    let inserts = "";

    if (!refreshToken) {
        sql = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        inserts = [
            "account",
            "password",
            hashedPassword,
            "is_changed_password",
            DB_CONSTANTS.ACCOUNT_ROLE_IS_CHANGE_PASSWORD_FIRST_TIME,
            "username",
            username
        ];
    } else {
        sql = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        inserts = [
            "account",
            "password",
            hashedPassword,
            "is_changed_password",
            DB_CONSTANTS.ACCOUNT_ROLE_IS_CHANGE_PASSWORD_FIRST_TIME,
            "refresh_token",
            refreshToken,
            "username",
            username
        ];
    }
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

module.exports = { changePassword }