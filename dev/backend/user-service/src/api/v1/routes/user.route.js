const { verifyIsActiveMiddleware, verifyAccessTokenMiddleware } = require('../middlewares');

const { loginValidator, changePasswordRequireValidator, changePasswordOptionalValidator } = require('../validators');

const router = require('express').Router();
const userController = require('../controllers/user.controller');

// Đăng nhập
router.post('/login', loginValidator, userController.LoginController);

// Đổi mật khẩu (Bắt buộc)
// Cần phải đăng nhập trước và có JWT
// Đồng thời is_activate trong JWT phải là false
router.post(
    '/change-password-require',
    verifyAccessTokenMiddleware,
    verifyIsActiveMiddleware(false),
    changePasswordRequireValidator,
    userController.ChangePasswordRequireController,
);

// Đổi mật khẩu (Tùy chọn)
// Cần phải đăng nhập trước và có JWT
// Đồng thời is_activate trong JWT phải là true
router.post(
    '/change-password-optional',
    verifyAccessTokenMiddleware,
    verifyIsActiveMiddleware(true),
    changePasswordOptionalValidator,
    userController.ChangePasswordOptionalController,
);

module.exports = router;
