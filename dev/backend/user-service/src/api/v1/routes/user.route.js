const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
});

const { ROLE_NAME_LEADER } = require('../constants/global.constant');

const { verifyIsActiveMiddleware, verifyRoleMiddleware, verifyAccessTokenMiddleware } = require('../middlewares');

const {
    loginValidator,
    changePasswordRequireValidator,
    changePasswordOptionalValidator,
    requestResetPasswordValidator,
} = require('../validators');

const router = require('express').Router();
const userController = require('../controllers/user.controller');

// Thống kê
router.get('/count-all-users', userController.CountAllUsersController);

router.get('/count-all-users-by-department-id', userController.CountAllUsersByDepartmentIDController);

// Đăng nhập
router.post('/login', loginValidator, userController.LoginController);

router.get(
    '/get-user-information',
    verifyAccessTokenMiddleware,
    verifyIsActiveMiddleware(true),
    userController.GetUserInformationController,
);

router.get(
    '/get-all-user-by-leader',
    verifyAccessTokenMiddleware,
    verifyIsActiveMiddleware(true),
    verifyRoleMiddleware([ROLE_NAME_LEADER]),
    userController.GetAllUserByLeaderController,
);

// Đổi ảnh đại diện
router.put(
    '/change-user-avatar',
    verifyAccessTokenMiddleware,
    verifyIsActiveMiddleware(true),
    upload.single('avatar'),
    userController.ChangeUserAvatarController,
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
