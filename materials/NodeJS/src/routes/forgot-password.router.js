const router = require('express').Router();

const forgotPasswordController = require('../controllers/forgot-password.controller');
const forgotPasswordValidator = require('../validators/forgot-password-validator');

// Gửi email và sđt zô route này để lấy mã OTP
router.post('/request-forgot-password-otp', forgotPasswordValidator.validatorForgotPasswordEmailAndPhoneNumber, forgotPasswordController.requestOTPController);

// Gửi email và sđt zô route này để lấy mã OTP
router.post('/verify-forgot-password-otp', forgotPasswordValidator.validatorForgotPasswordOTP, forgotPasswordController.verifyOTPController);


module.exports = router
