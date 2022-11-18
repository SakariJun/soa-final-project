const getPersonalInformationRouter = require('./get-personal-information.router');
const adminAccountManagementRouter = require('./admin-account-management.router');
const adminTransferManagementRouter = require('./admin-transfer-management.router');
const updateIdentityCardRouter = require('./update-identity-card.router');
const changePasswordRouter = require('./change-password.router');
const forgotPasswordRouter = require('./forgot-password.router');
const digitalWalletRouter = require('./digital-wallet.router');
const registerRouter = require('./register.router');
const loginRouter = require('./login.router');

const { verifyAccessTokenMiddleware } = require('../middlewares/json-web-token.middleware');
const { verifyAdminRoleMiddleware } = require('../middlewares/authorization-role-admin.middleware');

function routes(app) {
    // Đăng nhập
    app.use('/api/login', loginRouter);

    // Đăng ký tài khoản
    app.use('/api/register', registerRouter);

    // Quên mật khẩu 
    // Yêu cầu mã OTP
    // Xác thực mã OTP
    app.use('/api/forgot-password', forgotPasswordRouter);

    // Xem thông tin cá nhân - lịch sử giao dịch...
    app.use('/api/get-personal-information', getPersonalInformationRouter);

    // Sử dụng dịch vụ của ví điện tử - Nạp, rút, chuyển tiền...
    app.use('/api/digital-wallet', verifyAccessTokenMiddleware, digitalWalletRouter);

    // Đổi mật khẩu bắt buộc khi đăng nhập lần đầu
    // Đổi mật khẩu khi có nhu cầu
    // Đổi mật khẩu khi sử dụng chức năng quên mật khẩu
    app.use('/api/change-password', verifyAccessTokenMiddleware, changePasswordRouter);

    // Cập nhật CMND
    app.use('/api/update-identity-card', verifyAccessTokenMiddleware, updateIdentityCardRouter);

    // Các chức năng quản lý của Admin
    // Lấy danh sách tài khoản theo trạng thái
    // Lấy danh sách tài khoản bị khóa
    // Mở khóa tài khoản...
    app.use('/api/admin-account-management', verifyAccessTokenMiddleware, verifyAdminRoleMiddleware, adminAccountManagementRouter);

    // Quản lý các giao dịch
    app.use('/api/admin-transfer-management', verifyAccessTokenMiddleware, verifyAdminRoleMiddleware, adminTransferManagementRouter);
}

module.exports = routes