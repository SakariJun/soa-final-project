const { signAccessToken, signRefreshToken } = require("../utils/json-web-token");
const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const { validationResult } = require('express-validator');
const loginRepos = require('../repos/login.repos');
const bcrypt = require("bcrypt");

async function authenticationUser(username, password) {
    const account = await loginRepos.getAccountByUsername(username);

    let accountResult = account[0];

    // Not found any account with Username
    if (accountResult.length === 0) {
        return {
            status: false,
            message: "Sai tên tài khoản hoặc mật khẩu ! Vui lòng nhập lại !" // Không ghi rõ là sai tên tài khoản để bảo mật + hạn chế dò tên tài khoản
        }
    }

    accountResult = accountResult[0];

    // Nếu là Role = User thì check xem có bị khóa hay gì không ngược lại là admin không cần check
    if (accountResult.role === DB_CONSTANTS.ACCOUNT_ROLE_USER) {
        // Account was disabled by Admin because the user is consider clone ...
        // Tài khoản bị vô hiệu hóa bởi admin do nghi ngờ tài khoản không hợp lệ...
        if (accountResult.state === DB_CONSTANTS.ACCOUNT_STATE_DISABLE) {
            return {
                status: false,
                message: "Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008 !"
            }
        }

        if (accountResult.is_banned === DB_CONSTANTS.ACCOUNT_IS_BANNED) {
            if (accountResult.login_failed_attempt >= 6) {
                // Khóa do đăng nhập sai 3 lần + đã có 1 lần cảnh báo
                return {
                    status: false,
                    message: "Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ !"
                };
            }

            const last_lock_time = new Date(accountResult.last_lock_time).getTime();
            const isGreaterThanOneMinute = new Date().getTime() - last_lock_time >= 60 * 1000;

            // Nếu tài khoản đang bị khóa + chưa đủ 1 phút thì báo lỗi
            if (!isGreaterThanOneMinute) {
                return {
                    status: false,
                    message: "Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút !"
                };
            }
        }
    }

    const isPasswordExactly = await bcrypt.compare(password, accountResult.password);

    // Nhập sai mật khẩu
    if (!isPasswordExactly) {
        // Admin đăng nhập sai không bị khóa tài khoản or tính số lần đăng nhập sai
        if (accountResult.role === DB_CONSTANTS.ACCOUNT_ROLE_USER) {
            // Nếu là USER thì tăng số lần đăng nhập sai lên
            const increaseResult = await increaseLoginFailedAttempt(accountResult.username, accountResult.login_failed_attempt);

            if (!increaseResult.status) {
                return increaseResult;
            }
        }

        return {
            status: false,
            message: "Sai tên tài khoản hoặc mật khẩu ! Vui lòng nhập lại !" // Không ghi rõ là sai tên tài khoản để bảo mật + hạn chế dò tên tài khoản
        };
    }

    // Đăng nhập thành công - Cập nhật số lần đăng nhập sai về 0 và cập nhật refreshToken
    // Trong AccessToken và RefreshToken lưu
    // Mã tài khoản, Quyền để có thể phân quyền sau này, trạng thái, có đổi mật khẩu trong lần đầu đăng nhập chưa ?
    const payload = {
        username: accountResult.username,
        role: accountResult.role,
        state: accountResult.state,
        is_changed_password: accountResult.is_changed_password,
        is_banned: accountResult.is_banned,
    }

    const token = await Promise.all([
        await signAccessToken(payload),
        await signRefreshToken(payload),
    ]);

    const accessToken = token[0];
    const refreshToken = token[1];

    const updateRefreshToken = await loginRepos.updateRefreshTokenAndResetLoginAttemptFailedByUsername(username, refreshToken);

    if (updateRefreshToken[0].affectedRows === 0) {
        // Generate JWT and send back to client
        return {
            status: false,
            message: "Lỗi hệ thống ! Cập nhật RefreshToken cho tài khoản thất bại !"
        }
    }

    // Generate JWT and send back to client
    return {
        status: true,
        message: "Đăng nhập thành công",
        accessToken: accessToken
    };
}

async function increaseLoginFailedAttempt(username, login_failed_attempt) {
    try {
        if (login_failed_attempt === 2 || login_failed_attempt === 5) {
            const updateResult = await loginRepos.updateLoginFailedAttemptAndBannedAccount(username, login_failed_attempt);

            if (updateResult[0].affectedRows === 0) {
                // Generate JWT and send back to client
                return {
                    status: false,
                    message: "Lỗi hệ thống ! Cập nhật số lần đăng nhập sai thất bại !"
                };
            }
        }

        const updateResult = await loginRepos.updateLoginFailedAttemptWithoutBannedAccount(username, login_failed_attempt);

        if (updateResult[0].affectedRows === 0) {
            return {
                status: false,
                message: "Lỗi hệ thống ! Cập nhật số lần đăng nhập sai thất bại !"
            };
        }

        return { status: true, message: "Update thành công " };
    } catch (err) {
        return { status: false, message: err.message };
    }
}

function validateLogin(req) {
    const validateLoginResult = validationResult(req);

    if (!validateLoginResult.isEmpty()) {
        return { status: false, message: validateLoginResult.errors[0].msg }
    }

    return { status: true, message: "OKE" }
}

module.exports = { validateLogin, authenticationUser }

