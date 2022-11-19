const router = require('express').Router();

const changePasswordValidator = require('../validators/change-password.validator');
const changePasswordController = require('../controllers/change-password.controller');

// Đổi mật khẩu bắt buộc khi đăng nhập lần đầu
router.post('/require', changePasswordValidator.validatorChangePasswordRequire,
    changePasswordController.changePasswordRequireController);

// Đổi mật khẩu tự chọn
router.post('/optional', changePasswordValidator.validatorChangePasswordOptional,
    changePasswordController.changePasswordOptionalController);

// Đổi mật khẩu đã quên
router.post('/forgot-password', changePasswordValidator.validatorChangePasswordRequire,
    changePasswordController.changePasswordForgotController);

module.exports = router
