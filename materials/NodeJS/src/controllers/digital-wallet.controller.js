const digitalWalletService = require('../services/digital-wallet.service')
const { validationResult } = require('express-validator');

const rechargeMoneyController = async(req, res, next) => {
    // Gọi hàm validate input từ service
    const isInputValid = digitalWalletService.validateRechargeMoney(req);

    if (!isInputValid.status) {
        return res.status(400).json(isInputValid);
    }

    // Validate thành công -> Tiến hành thao tác đăng ký
    const rechargeMoneyResult = await digitalWalletService.rechargeMoneyFromCreditCard(req.payload, req.body);

    if (!rechargeMoneyResult.status) {
        return res.status(400).json(rechargeMoneyResult);
    }

    return res.status(200).json(rechargeMoneyResult);
}

const withdrawMoneyController = async(req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: false,
            // Lấy về 1 message lỗi đầu tiên
            message: errors.array().map(err => { return err.msg })[0]
        });
    }

    const withdrawMoneyResult = await digitalWalletService.withdrawMoney(req.payload, req.body);

    if (!withdrawMoneyResult.status) {
        return res.status(400).json(withdrawMoneyResult);
    }

    return res.status(200).json(withdrawMoneyResult);
}

const transferMoneyController = async(req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: false,
            // Lấy về 1 message lỗi đầu tiên
            message: errors.array().map(err => { return err.msg })[0]
        });
    }

    const transferMoneyResult = await digitalWalletService.transferMoney(req.payload, req.body);

    if (!transferMoneyResult.status) {
        return res.status(400).json(transferMoneyResult);
    }

    return res.status(200).json(transferMoneyResult);
}

const verifyOTPController = async(req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: false,
            // Lấy về 1 message lỗi đầu tiên
            message: errors.array().map(err => { return err.msg })[0]
        });
    }

    const verifyOTPTransferMoney = await digitalWalletService.verifyOTPTransferMoney(req.payload, req.body.OTP);

    if (!verifyOTPTransferMoney.status) {
        return res.status(400).json(verifyOTPTransferMoney);
    }

    return res.status(200).json(verifyOTPTransferMoney);
}

const servicePaymentController = async(req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: false,
            // Lấy về 1 message lỗi đầu tiên
            message: errors.array().map(err => { return err.msg })[0]
        });
    }

    const servicePayment = await digitalWalletService.servicePayment(req.payload, req.body);

    if (!servicePayment.status) {
        return res.status(400).json(servicePayment);
    }

    return res.status(200).json(servicePayment);
}

const transferHistoryController = async(req, res, next) => {

    const transferHistoryResult = await digitalWalletService.transferHistory(req.payload, req.params.id);

    if (!transferHistoryResult.status) {
        return res.status(400).json(transferHistoryResult);
    }

    return res.status(200).json(transferHistoryResult);
}

const findUserByPhoneController = async(req, res, next) => {
    const findUserByPhoneResult = await digitalWalletService.findUserByPhone(req.params.phone);

    if (!findUserByPhoneResult.status) {
        return res.status(400).json(findUserByPhoneResult);
    }

    return res.status(200).json(findUserByPhoneResult);
}

module.exports = {
    rechargeMoneyController,
    withdrawMoneyController,
    transferMoneyController,
    verifyOTPController,
    servicePaymentController,
    transferHistoryController,
    findUserByPhoneController
}