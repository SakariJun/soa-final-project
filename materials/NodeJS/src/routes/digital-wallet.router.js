const router = require('express').Router();

const digitalWalletValidator = require('../validators/digital-wallet.validator');
const digitalWalletController = require('../controllers/digital-wallet.controller');

// Nạp tiền
router.post('/recharge-money', digitalWalletValidator.rechargeMoneyValidator,
    digitalWalletController.rechargeMoneyController);

// Rút tiền
router.post('/withdraw-money', digitalWalletValidator.withdrawMoneyValidator,
    digitalWalletController.withdrawMoneyController);

// Chuyển tiền
router.post('/transfer-money', digitalWalletValidator.transferMoneyValidator,
    digitalWalletController.transferMoneyController);

// Xác nhận OTP chuyển tiền
router.post('/transfer-money/verify', digitalWalletValidator.verifyTransferMoneyOTP, digitalWalletController.verifyOTPController);

// Lấy thông tin user từ số điện thoại
router.get('/transfer-money/find/:phone', digitalWalletController.findUserByPhoneController);

// Dịch vụ 
router.post('/service-payment', digitalWalletValidator.servicePaymentValidator,
    digitalWalletController.servicePaymentController);

// Lịch sử giao dịch tổng quan
router.get('/transfer-history', digitalWalletController.transferHistoryController)

// Thông tin chi tiết một lịch sử giao dịch
router.get('/transfer-history/:id', digitalWalletController.transferHistoryController)

module.exports = router