const forgotPasswordService = require('../services/forgot-password.service')

const requestOTPController = async(req, res, next) => {
    // Gọi hàm validate input từ service
    const isInputValid = forgotPasswordService.validateForgotPassword(req);

    if (!isInputValid.status) {
        return res.status(400).json(isInputValid);
    }

    // Validate thành công -> Tiến hành thao tác đăng ký
    const forgotPasswordResult = await forgotPasswordService.requestOTPService(req.body.email, req.body['phone_number']);

    if (!forgotPasswordResult.status) {
        return res.status(400).json(forgotPasswordResult);
    }

    return res.status(200).json(forgotPasswordResult);
}

const verifyOTPController = async(req, res, next) => {
    // Gọi hàm validate input từ service
    const isInputValid = forgotPasswordService.validateForgotPasswordOTP(req);

    if (!isInputValid.status) {
        return res.status(400).json(isInputValid);
    }

    // Validate thành công -> Tiến hành thao tác đăng ký
    const verifyOTPResult = await forgotPasswordService.verifyOTPService(req.body.email, req.body['phone_number'], req.body['forgot-password-otp']);

    if (!verifyOTPResult.status) {
        return res.status(400).json(verifyOTPResult);
    }

    return res.status(200).json(verifyOTPResult);
}

module.exports = {
    requestOTPController,
    verifyOTPController,
}