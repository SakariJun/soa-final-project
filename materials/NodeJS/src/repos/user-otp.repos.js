const { pool } = require('../configs/database');
const mysql = require('mysql2');

function generateOTP() {
    // random range từ 100000 -> 999999
    return Math.floor(Math.random() * (999999 - 100000)) + 100000;
}

async function insertUserOTP(user_id, otp, data) {
    let sql_insert_user_otp = `UPDATE ?? SET ?? = ?, ?? = ?, created_at = CURRENT_TIMESTAMP() WHERE ?? = ?`

    let inserts_user_otp = [
        "user_otp",
        "otp",
        otp,
        "data",
        data,
        "user_id",
        user_id
    ];
    sql_insert_user_otp = mysql.format(sql_insert_user_otp, inserts_user_otp);

    return await pool.promise().query(sql_insert_user_otp);
}

async function getUserOTPData(user_id, otp) {
    let sql = `SELECT * FROM ?? WHERE ?? = ? AND ?? = ?`

    let inserts = [
        "user_otp",
        "otp",
        otp,
        "user_id",
        user_id
    ];
    sql = mysql.format(sql, inserts);

    const dataOTP = await pool.promise().query(sql);

    // OTP chỉ sử dụng 1 lần -> reset sau khi lấy data
    // tránh user spam nhiều lần trong 60s
    sql = `UPDATE ?? SET ?? = ? WHERE ?? = ?`

    inserts = [
        "user_otp",
        "otp",
        null,
        "user_id",
        user_id
    ];
    sql = mysql.format(sql, inserts);

    const resetOTP = await pool.promise().query(sql);

    return dataOTP;
}

module.exports = {
    insertUserOTP,
    getUserOTPData,
    generateOTP
}