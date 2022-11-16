const createError = require('http-errors');

const PublishServiceEvent = require('../utils/service-communicate.util');
const { SERVICE_USER, SERVICE_USER_EVENTS_GET_ROLE_BY_USER_ID } = require('../constants/global.constant');
const verifyRoleMiddleware = (roles) => {
    if (roles.length === 0) {
        return createError.Unauthorized();
    }

    return async (req, res, next) => {
        // Check if the request is called by AJAX - Fetch and expect to receive JSON Response
        const payload = {
            event: SERVICE_USER_EVENTS_GET_ROLE_BY_USER_ID,
            data: {
                user_id: req.payload.user_id,
            },
        };

        const accountRole = await PublishServiceEvent(payload, SERVICE_USER);

        if (!accountRole.status) {
            return res.status(400).json(accountRole);
        }

        if (!roles.includes(accountRole.data)) {
            return res.status(403).json({
                status: false,
                message: 'Bạn không có quyền sử dụng tính năng này !',
            });
        }

        next();
    };
};

module.exports = verifyRoleMiddleware;
