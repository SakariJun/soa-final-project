const changePasswordService = require('../services/change-password.service')

const changePasswordRequireController = async (req, res, next) => {
    // Gọi hàm validate input từ service
    const isInputValid = changePasswordService.validateChangePasswordRequire(req);

    if (!isInputValid.status) {
        return res.status(400).json(isInputValid);
    }

    // Validate thành công -> Tiến hành thao tác đăng ký
    const changePasswordRequireResult = await changePasswordService.changePasswordRequireService(req.payload.username, req.body['new-password']);

    if (!changePasswordRequireResult.status) {
        return res.status(400).json(changePasswordRequireResult);
    }

    const newDate = new Date();
    const expDate = newDate.setMonth(newDate.getMonth() + 3);
    res.cookie('accessToken', changePasswordRequireResult.accessToken, { sameSite: true, maxAge: expDate, httpOnly: true, secure: true });


    return res.status(201).json(changePasswordRequireResult);
}

const changePasswordOptionalController = async (req, res, next) => {
    // Gọi hàm validate input từ service
    const isInputValid = changePasswordService.validateChangePasswordOptional(req);

    if (!isInputValid.status) {
        return res.status(400).json(isInputValid);
    }

    // Validate thành công -> Tiến hành thao tác đăng ký
    const changePasswordOptionalResult = await changePasswordService.changePasswordOptionalService(req.payload.username, req.body['old-password'], req.body['new-password']);

    if (!changePasswordOptionalResult.status) {
        return res.status(400).json(changePasswordOptionalResult);
    }

    return res.status(201).json(changePasswordOptionalResult);
}

const changePasswordForgotController = async (req, res, next) => {
    // Gọi hàm validate input từ service
    const isInputValid = changePasswordService.validateChangePasswordForgot(req);

    if (!isInputValid.status) {
        return res.status(400).json(isInputValid);
    }

    // Validate thành công -> Tiến hành thao tác đăng ký
    const changePasswordForgotResult = await changePasswordService.changePasswordForgotService(req.payload.username, req.body['new-password']);

    if (!changePasswordForgotResult.status) {
        return res.status(400).json(changePasswordForgotResult);
    }

    return res.status(201).json(changePasswordForgotResult);
}

module.exports = {
    changePasswordRequireController,
    changePasswordOptionalController,
    changePasswordForgotController,
}
