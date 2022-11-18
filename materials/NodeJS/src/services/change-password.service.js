const { signAccessToken, signRefreshToken } = require("../utils/json-web-token");
const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const { changePassword } = require('../repos/change-password.repos');
const { getAccountByUsername } = require('../repos/login.repos');
const { validationResult } = require('express-validator');
const bcrypt = require("bcrypt");

async function changePasswordRequireService(username, newPassword) {
    const account = await getAccountByUsername(username);

    let accountResult = account[0];

    // Not found any account with Username
    if (accountResult.length === 0) {
        return {
            status: false,
            message: "Tên tài khoản không đúng ! Vui lòng thử lại"
        }
    }

    accountResult = accountResult[0];

    // Nếu là người dùng thì check xem có bị khóa hay gì không
    if (accountResult.role === DB_CONSTANTS.ACCOUNT_ROLE_USER) {
        // Account was disabled by Admin because the user is consider clone ...
        if (accountResult.state === DB_CONSTANTS.ACCOUNT_STATE_DISABLE) {
            return {
                status: false,
                message: "Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008 !"
            }
        }
    }

    const payload = {
        username: accountResult.username,
        role: accountResult.role,
        state: accountResult.state,
        is_changed_password: DB_CONSTANTS.ACCOUNT_ROLE_IS_CHANGE_PASSWORD_FIRST_TIME,
        is_banned: accountResult.is_banned,
    }

    const token = await Promise.all([
        await signAccessToken(payload),
        await signRefreshToken(payload),
    ]);

    const accessToken = token[0];
    const refreshToken = token[1];

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const changePasswordResult = await changePassword(username, hashedPassword, refreshToken);

    if (changePasswordResult[0].affectedRows === 0) {
        return {
            status: false,
            message: "Lỗi hệ thống ! Đổi mật khẩu thất bại ! Vui lòng thử lại sau"
        }
    }

    return {
        status: true,
        message: "Đổi mật khẩu thành công",
        accessToken: accessToken
    };
}

async function changePasswordOptionalService(username, oldPassword, newPassword) {
    const account = await getAccountByUsername(username);

    let accountResult = account[0];

    // Not found any account with Username
    if (accountResult.length === 0) {
        return {
            status: false,
            message: "Tên tài khoản không đúng ! Vui lòng thử lại"
        }
    }

    accountResult = accountResult[0];

    // Nếu là người dùng thì check xem có bị khóa hay gì không
    if (accountResult.role === DB_CONSTANTS.ACCOUNT_ROLE_USER) {
        // Account was disabled by Admin because the user is consider clone ...
        if (accountResult.state === DB_CONSTANTS.ACCOUNT_STATE_DISABLE) {
            return {
                status: false,
                message: "Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008 !"
            }
        }
    }

    const isOldPasswordExactly = await bcrypt.compare(oldPassword, accountResult.password);

    // Nhập sai mật khẩu
    if (!isOldPasswordExactly) {
        return {
            status: false,
            message: "Mật khẩu cũ không chính xác ! Vui lòng nhập lại !"
        };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const changePasswordResult = await changePassword(username, hashedPassword);

    if (changePasswordResult[0].affectedRows === 0) {
        return {
            status: false,
            message: "Lỗi hệ thống ! Đổi mật khẩu thất bại ! Vui lòng thử lại sau"
        }
    }

    return {
        status: true,
        message: "Đổi mật khẩu thành công"
    };
}

async function changePasswordForgotService(username, newPassword) {
    const account = await getAccountByUsername(username);

    let accountResult = account[0];

    // Not found any account with Username
    if (accountResult.length === 0) {
        return {
            status: false,
            message: "Tên tài khoản không đúng ! Vui lòng thử lại"
        }
    }

    accountResult = accountResult[0];

    // Nếu là người dùng thì check xem có bị khóa hay gì không
    if (accountResult.role === DB_CONSTANTS.ACCOUNT_ROLE_USER) {
        // Account was disabled by Admin because the user is consider clone ...
        if (accountResult.state === DB_CONSTANTS.ACCOUNT_STATE_DISABLE) {
            return {
                status: false,
                message: "Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008 !"
            }
        }
    }

    const payload = {
        username: accountResult.username,
        role: accountResult.role,
        state: accountResult.state,
        is_changed_password: DB_CONSTANTS.ACCOUNT_ROLE_IS_CHANGE_PASSWORD_FIRST_TIME,
        is_banned: accountResult.is_banned,
    }

    const token = await Promise.all([
        await signAccessToken(payload),
        await signRefreshToken(payload),
    ]);

    const accessToken = token[0];
    const refreshToken = token[1];

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const changePasswordResult = await changePassword(username, hashedPassword, refreshToken);

    if (changePasswordResult[0].affectedRows === 0) {
        return {
            status: false,
            message: "Lỗi hệ thống ! Đổi mật khẩu thất bại ! Vui lòng thử lại sau"
        }
    }

    return {
        status: true,
        message: "Đổi mật khẩu đã quên thành công",
        accessToken: accessToken
    };
}


function validateChangePasswordOptional(req) {
    const validateChangePasswordOptionalResult = validationResult(req);

    if (!validateChangePasswordOptionalResult.isEmpty()) {
        return { status: false, message: validateChangePasswordOptionalResult.errors[0].msg }
    }

    if (req.body['new-password'] != req.body['new-password-confirm']) {
        return { status: false, message: "Mật khẩu mới và mật khẩu xác nhận không khớp ! Vui lòng nhập lại !" }
    }

    if (req.payload.is_changed_password === DB_CONSTANTS.ACCOUNT_ROLE_NOT_CHANGE_PASSWORD_FIRST_TIME) {
        return { status: false, message: "Bạn chưa đổi mật khẩu lần đầu đăng nhập ! Không thể sử dụng tính năng này !" }
    }

    return { status: true, message: "OKE" }
}

function validateChangePasswordRequire(req) {
    const validateChangePasswordRequireResult = validationResult(req);

    if (!validateChangePasswordRequireResult.isEmpty()) {
        return { status: false, message: validateChangePasswordRequireResult.errors[0].msg }
    }

    if (req.body['new-password'] != req.body['new-password-confirm']) {
        return { status: false, message: "Mật khẩu mới và mật khẩu xác nhận không khớp ! Vui lòng nhập lại !" }
    }

    if (req.payload.is_changed_password === DB_CONSTANTS.ACCOUNT_ROLE_IS_CHANGE_PASSWORD_FIRST_TIME) {
        return { status: false, message: "Bạn đã đổi mật khẩu lần đầu đăng nhập ! Không thể sử dụng tính năng này !" }
    }

    return { status: true, message: "OKE" }
}

function validateChangePasswordForgot(req) {
    const validateChangePasswordRequireResult = validationResult(req);

    if (!validateChangePasswordRequireResult.isEmpty()) {
        return { status: false, message: validateChangePasswordRequireResult.errors[0].msg }
    }

    if (req.body['new-password'] != req.body['new-password-confirm']) {
        return { status: false, message: "Mật khẩu mới và mật khẩu xác nhận không khớp ! Vui lòng nhập lại !" }
    }

    return { status: true, message: "OKE" }
}


module.exports = { validateChangePasswordRequire, 
    validateChangePasswordOptional,
    validateChangePasswordForgot, 
    changePasswordRequireService, 
    changePasswordOptionalService,
    changePasswordForgotService,
}