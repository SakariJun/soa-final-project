const createError = require('http-errors');

const verifyRoleMiddleware = (roles) => {
    if (roles.length === 0) {
        return createError.Unauthorized();
    }

    return async (req, res, next) => {
        if (!roles.includes(req.payload.role_name)) {
            return res.status(403).json({
                status: false,
                message: 'Bạn không có quyền sử dụng tính năng này !',
            });
        }

        next();
    };
};

module.exports = verifyRoleMiddleware;
