const { verifyIsActiveMiddleware, verifyAccessTokenMiddleware } = require('../middlewares');

const {
    loginValidator,
    changePasswordRequireValidator,
    changePasswordOptionalValidator,
    requestResetPasswordValidator,
} = require('../validators');

const router = require('express').Router();
const userController = require('../controllers/user.controller');

// Đăng nhập
router.post('/login', loginValidator, userController.LoginController);

router.get(
    '/get-user-information',
    verifyAccessTokenMiddleware,
    verifyIsActiveMiddleware(true),
    userController.GetUserInformationController,
);

// Đổi mật khẩu (Bắt buộc)
// Cần phải đăng nhập trước và có JWT
// Đồng thời is_activate trong JWT phải là false
router.put(
    '/change-password-require',
    verifyAccessTokenMiddleware,
    verifyIsActiveMiddleware(false),
    changePasswordRequireValidator,
    userController.ChangePasswordRequireController,
);

// Đổi mật khẩu (Tùy chọn)
// Cần phải đăng nhập trước và có JWT
// Đồng thời is_activate trong JWT phải là true
router.put(
    '/change-password-optional',
    verifyAccessTokenMiddleware,
    verifyIsActiveMiddleware(true),
    changePasswordOptionalValidator,
    userController.ChangePasswordOptionalController,
);

// Gửi yêu cầu đặt lại mật khẩu
// Cần phải đăng nhập trước và có JWT
// Đồng thời is_activate trong JWT phải là true
router.post('/request-reset-password', requestResetPasswordValidator, userController.RequestResetPasswordController);

module.exports = router;
