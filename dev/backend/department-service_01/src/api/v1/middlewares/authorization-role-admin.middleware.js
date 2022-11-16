const createError = require('http-errors');

const verifyRoleMiddleware = (roles) => {
    if (roles.length !== 0) {
        return createError.NotAcceptable();
    }

    return async (req, res, next) => {
        // Check if the request is called by AJAX - Fetch and expect to receive JSON Response
        const accountRole = await getRoleById(req.payload.user_id);

        // Not found any account with Username
        if (accountRoleResult.length === 0) {
            return res.status(403).json({
                status: false,
                message: 'Tên tài khoản không tồn tại ! Vui lòng thử lại !',
            });
        }

        if (!roles.includes(accountRole)) {
            return res.status(403).json({
                status: false,
                message: 'Bạn không có quyền sử dụng tính năng này !',
            });
        }

        next();
    };
};

module.exports = { verifyRoleMiddleware };
