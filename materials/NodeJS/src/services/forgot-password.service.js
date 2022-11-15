const { encryptMessage, decryptMessage } = require('../utils/encrypt-decrypt-string');
const { validateEmail, validatePhoneNumber } = require('../utils/validate-helper');
const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const forgotPasswordRepos = require('../repos/forgot-password.repos');
const { signAccessToken } = require("../utils/json-web-token");
const { validationResult } = require('express-validator');
const { sendMail } = require('../utils/send-mail-util');
const userOTPRepos = require('../repos/user-otp.repos')

async function requestOTPService(email, phone_number) {
    let getAccountByEmailAndPhoneNumber = await forgotPasswordRepos.getAccountByEmailAndPhoneNumber(email, phone_number);

    if (getAccountByEmailAndPhoneNumber[0].length === 0) {
        return {
            status: false,
            message: `Không tìm thấy thông tin người dùng với email: ${email}, số điện thoại ${phone_number} ! Vui lòng kiểm tra lại thông tin !`,
        };
    }

    getAccountByEmailAndPhoneNumber = getAccountByEmailAndPhoneNumber[0][0];

    // Nếu là người dùng thì check xem có bị khóa hay gì không
    if (getAccountByEmailAndPhoneNumber.role === DB_CONSTANTS.ACCOUNT_ROLE_USER) {
        // Account was disabled by Admin because the user is consider clone ...
        if (getAccountByEmailAndPhoneNumber.state === DB_CONSTANTS.ACCOUNT_STATE_DISABLE) {
            return {
                status: false,
                message: "Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008 !"
            }
        }

        if (getAccountByEmailAndPhoneNumber.is_banned === DB_CONSTANTS.ACCOUNT_IS_BANNED) {
            return {
                status: false,
                message: "Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ !"
            }
        }
    }

    // Send OTP to mail
    const OTP_Payload = {
        email,
        phone_number,
        created_at: new Date().getTime(),
    }

    const data = encryptMessage(JSON.stringify(OTP_Payload));
    const OTP = userOTPRepos.generateOTP();

    if (!data.status) {
        return { status: false, message: "Có lỗi trong quá trình sinh mã OTP ! Vui lòng thử lại sau !" };
    }

    const insertUserOTP = await userOTPRepos.insertUserOTP(getAccountByEmailAndPhoneNumber['user_id'], OTP, data.encryptedData)

    if (insertUserOTP[0].length < 1) {
        return {
            status: false,
            message: "Có lỗi xảy ra trong quá trình tạo mã OTP. Vui lòng thử lại sau.",
        };
    }



    // Xử lý gửi mail trong đây.
    const subject = "Khôi phục mật khẩu - Hệ thống ví điện tử ABC";
    const mailContent = `Bạn đã sử dụng chức năng khôi phục mật khẩu ! Đây là mã OTP của bạn ${OTP}, Mã OTP chỉ có hiệu lực trong vòng 1 phút ! Vui lòng nhập mã OTP vào giao diện quên mật khẩu để tiếp tục !`

    try {
        //const sendMailResult = await sendMail(email, subject, mailContent);

        return {
            status: true,
            message: "Gửi mã OTP đến mail thành công ! Vui lòng kiểm tra mail để nhận mã OTP",
            OTP: OTP,
        };

    } catch (err) {
        return { status: false, message: "Có lỗi trong quá trình gửi thông tin tài khoản đến mail của người dùng ! Vui lòng thử lại sau !" };
    }
}

async function verifyOTPService(email, phone_number, OTP) {
    let getAccountByEmailAndPhoneNumber = await forgotPasswordRepos.getAccountByEmailAndPhoneNumber(email, phone_number);

    if (getAccountByEmailAndPhoneNumber[0].length === 0) {
        return {
            status: false,
            message: `Không tìm thấy thông tin người dùng với email: ${email}, số điện thoại ${phone_number} ! Vui lòng kiểm tra lại thông tin !`,
        };
    }

    getAccountByEmailAndPhoneNumber = getAccountByEmailAndPhoneNumber[0][0];

    // Nếu là người dùng thì check xem có bị khóa hay gì không
    if (getAccountByEmailAndPhoneNumber.role === DB_CONSTANTS.ACCOUNT_ROLE_USER) {
        // Account was disabled by Admin because the user is consider clone ...
        if (getAccountByEmailAndPhoneNumber.state === DB_CONSTANTS.ACCOUNT_STATE_DISABLE) {
            return {
                status: false,
                message: "Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008 !"
            }
        }

        if (getAccountByEmailAndPhoneNumber.is_banned === DB_CONSTANTS.ACCOUNT_IS_BANNED) {
            return {
                status: false,
                message: "Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ !"
            }
        }
    }

    let dataOTP = await userOTPRepos.getUserOTPData(getAccountByEmailAndPhoneNumber['user_id'], OTP)
    dataOTP = dataOTP[0]

    if (dataOTP.length < 1) {
        return {
            status: false,
            message: "Mã OTP không tồn tại. Vui lòng kiểm tra lại."
        }
    }
    dataOTP = dataOTP[0]

    try {
        const verifyOTPResult = decryptMessage(dataOTP['data']);

        if (!verifyOTPResult.status) {
            return { status: false, message: "Mã OTP không hợp lệ ! Vui lòng nhập lại !" };
        }

        const OTP_payload = JSON.parse(verifyOTPResult.decryptedData);

        if (!OTP_payload.email || !OTP_payload.phone_number || !OTP_payload.created_at) {
            return { status: false, message: "Mã OTP không hợp lệ ! Vui lòng nhập lại !" };
        }

        if (!validatePhoneNumber(OTP_payload.phone_number)) {
            return { status: false, message: "Mã OTP không hợp lệ ! Vui lòng nhập lại !" };
        }

        if (!validateEmail(OTP_payload.email)) {
            return { status: false, message: "Mã OTP không hợp lệ ! Vui lòng nhập lại !" };
        }

        const OTP_created_at = new Date(OTP_payload.created_at).getTime();
        const isGreaterThanOneMinute = new Date().getTime() - OTP_created_at >= 60 * 1000;

        if (isGreaterThanOneMinute) {
            return { status: false, message: "Mã OTP đã hết hạn ! Vui lòng gửi yêu cầu lấy lại OTP mới ! Hãy nhớ mã OTP chỉ có hiệu lực trong vòng 1 phút !" };
        }

        let getAccountByEmailAndPhoneNumber = await forgotPasswordRepos.getAccountByEmailAndPhoneNumber(OTP_payload.email, OTP_payload.phone_number);

        if (getAccountByEmailAndPhoneNumber[0].length === 0) {
            return { status: false, message: "Mã OTP không hợp lệ ! Vui lòng nhập lại !" };
        }

        getAccountByEmailAndPhoneNumber = getAccountByEmailAndPhoneNumber[0][0];

        // Nếu là người dùng thì check xem có bị khóa hay gì không
        if (getAccountByEmailAndPhoneNumber.role === DB_CONSTANTS.ACCOUNT_ROLE_USER) {
            // Account was disabled by Admin because the user is consider clone ...
            if (getAccountByEmailAndPhoneNumber.state === DB_CONSTANTS.ACCOUNT_STATE_DISABLE) {
                return {
                    status: false,
                    message: "Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008 !"
                }
            }

            if (getAccountByEmailAndPhoneNumber.is_banned === DB_CONSTANTS.ACCOUNT_IS_BANNED) {
                return {
                    status: false,
                    message: "Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ !"
                }
            }
        }

        const payload = {
            username: getAccountByEmailAndPhoneNumber.username
        }

        const forgotPasswordToken = await signAccessToken(payload);

        return { status: true, message: "Mã OTP hợp lệ ! Vui lòng nhập mật khẩu mới và xác nhận mật khẩu mới !", forgotPasswordToken }
    } catch (err) {
        return { status: false, message: "Mã OTP không hợp lệ ! Vui lòng nhập lại !" };
    }
}

function validateForgotPassword(req) {
    const validateResult = validationResult(req);

    if (!validateResult.isEmpty()) {
        return { status: false, message: validateResult.errors[0].msg }
    }

    let phone_number = req.body.phone_number;
    let email = req.body.email;

    if (!validatePhoneNumber(phone_number)) {
        return {
            status: false,
            message: "Số điện thoại không hợp lệ ! Vui lòng nhập lại !",
        };
    }

    if (!validateEmail(email)) {
        return {
            status: false,
            message: "Định dạng email không hợp lệ ! Vui lòng nhập lại !",
        };
    }

    return { status: true, message: "OKE" }
}

function validateForgotPasswordOTP(req) {
    const validateResult = validationResult(req);

    if (!validateResult.isEmpty()) {
        return { status: false, message: validateResult.errors[0].msg }
    }

    return { status: true, message: "OKE" }
}

module.exports = {
    validateForgotPassword,
    validateForgotPasswordOTP,
    verifyOTPService,
    requestOTPService,
}