const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const { pool } = require('../configs/database');
const mysql = require('mysql2');

async function getUpdateIdentityCardUserByUsername(username) {
    let sql = `SELECT ??, ??, ?? FROM ??
            JOIN ?? ON account.account_id = user.user_account_id
            WHERE account.username = ?`
    let inserts = [
        "state",
        "identity_card_front",
        "identity_card_back",
        "account",
        "user",
        username,
    ];

    
    sql = mysql.format(sql, inserts);
    
    return await pool.promise().query(sql);
}

// Cập nhật ảnh trong db và trạng thái về "Chưa xác minh"
async function updateIdentityCardUserByUsername(username, identity_card_front, identity_card_back) {
    let sql = `UPDATE ?? 
            JOIN ?? ON account.account_id = user.user_account_id
            SET ?? = ?, ?? = ?, ?? = ? 
            WHERE account.username = ?`
    let inserts = [
        "user",
        "account",
        "identity_card_front",
        identity_card_front,
        "identity_card_back",
        identity_card_back,
        "state",
        DB_CONSTANTS.ACCOUNT_STATE_WAITING_VERIFY,
        username,
    ];

    
    sql = mysql.format(sql, inserts);
    
    return await pool.promise().query(sql);
}

module.exports = { 
    getUpdateIdentityCardUserByUsername, 
    updateIdentityCardUserByUsername,
}