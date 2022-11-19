const { verifyAccessTokenMiddleware, verifyRoleMiddleware, verifyServiceAPIKeyMiddleware } = require('../middlewares');

const { ROLE_NAME_DIRECTOR } = require('../constants/global.constant');

const userRoute = require('./user.route');
const roleRoute = require('./role.route');
const userAdminRoute = require('./user-admin.route');

const ServiceEventsController = require('../controllers/service-events.controller');

const routes = function (app) {
    app.use(`/user`, userRoute);

    // Để sử dụng các chức năng quản lý người dùng của admin
    // Cần có JWT và ROLe = Giám đốc
    app.use(`/user-admin`, verifyAccessTokenMiddleware, verifyRoleMiddleware([ROLE_NAME_DIRECTOR]), userAdminRoute);

    app.use(`/role`, verifyServiceAPIKeyMiddleware, roleRoute);
    app.use(`/service-events`, verifyServiceAPIKeyMiddleware, ServiceEventsController);
};

module.exports = routes;
