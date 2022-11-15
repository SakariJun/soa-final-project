const createError = require('http-errors');

const _Role = require('../models/role.model');

const verifyRoleMiddleware = (roles) => {
    if (roles.length === 0) {
        return createError.Unauthorized();
    }

    return async (req, res, next) => {
        // Check if the request is called by AJAX - Fetch and expect to receive JSON Response
        const accountRole = await _Role.findById(req.payload.role_id).lean();

        if (!accountRole) {
            return res.status(400).json({
                status: false,
                message: 'Tên tài khoản không tồn tại ! Vui lòng thử lại !',
            });
        }

        if (!roles.includes(accountRole.name)) {
            return res.status(403).json({
                status: false,
                message: 'Bạn không có quyền sử dụng tính năng này !',
            });
        }

        next();
    };
};

module.exports = verifyRoleMiddleware;
