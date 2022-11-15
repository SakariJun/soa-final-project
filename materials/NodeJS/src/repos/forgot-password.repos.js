const { pool } = require('../configs/database');
const mysql = require('mysql2');

async function getAccountByEmailAndPhoneNumber(email, phone_number) {
    let sql = "SELECT ??, ??, ??, ??, ?? FROM ?? JOIN ?? ON user.user_id = account.account_id WHERE ?? = ? AND ?? = ?";
    let inserts = [
        "username",
        "state",
        "role",
        "is_banned",
        "user_id",
        "account",
        "user",
        "email",
        email,
        "phone_number",
        phone_number,
    ];
    sql = mysql.format(sql, inserts);

    return await pool.promise().query(sql);
}

module.exports = {
    getAccountByEmailAndPhoneNumber,
}