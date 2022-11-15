const { verifyAccessTokenMiddleware, verifyRoleMiddleware } = require('../middlewares');

const { ROLE_NAME_DIRECTOR } = require('../constants/global.constant');

const userRoute = require('./user.route');
const userAdminRoute = require('./user-admin.route');

const ServiceEventsController = require('../services/service-event.service');

const routes = function (app) {
    const PREFIX = '/api/v1/employee-management';

    app.use(`${PREFIX}/user`, userRoute);

    // Để sử dụng các chức năng quản lý người dùng của admin
    // Cần có JWT và ROLe = Giám đốc
    app.use(
        `${PREFIX}/user-admin`,
        verifyAccessTokenMiddleware,
        verifyRoleMiddleware([ROLE_NAME_DIRECTOR]),
        userAdminRoute,
    );

    app.use(`/service-events`, ServiceEventsController);
};

module.exports = routes;
