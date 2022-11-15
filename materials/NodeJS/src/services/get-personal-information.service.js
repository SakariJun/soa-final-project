
const DB_CONSTANTS = require('../utils/database-constant-number.utils');
const { getPersonalInformation } = require('../repos/get-personal-information.repos');


async function getPersonalInformationService(payload) {
    const personalInformation = await getPersonalInformation(payload.username);

    let personalInformationResult = personalInformation[0];

    // Not found any account with Username
    if (personalInformationResult.length === 0) {
        return {
            status: false,
            message: "Tên tài khoản không đúng không thể lấy thông tin cá nhân ! Vui lòng thử lại !"
        }
    }

    personalInformationResult = personalInformationResult[0];

    // Nếu là người dùng thì check xem có bị khóa hay gì không
    if (personalInformationResult.role === DB_CONSTANTS.ACCOUNT_ROLE_USER) {
        // Account was disabled by Admin because the user is consider clone ...
        if (personalInformationResult.state === DB_CONSTANTS.ACCOUNT_STATE_DISABLE) {
            return {
                status: false,
                message: "Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008 !"
            }
        }
    }

    // Xóa property dư thừa + nhạy cảm
    delete personalInformationResult['password'];
    delete personalInformationResult['refresh_token'];
    delete personalInformationResult['login_failed_attempt'];
    delete personalInformationResult['last_lock_time'];
    delete personalInformationResult['is_banned'];
    delete personalInformationResult['banned_date'];
    delete personalInformationResult['user_account_id'];
    delete personalInformationResult['user_wallet_id'];

    return {
        status: true,
        message: "Lấy thông tin cá nhân thành công",
        data: personalInformationResult,
    };
}

module.exports = { getPersonalInformationService }