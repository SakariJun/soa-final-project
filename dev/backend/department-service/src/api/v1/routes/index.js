const { verifyRoleMiddleware, verifyAccessTokenMiddleware, verifyServiceAPIKeyMiddleware } = require('../middlewares');

const { ROLE_NAME_DIRECTOR } = require('../constants/global.constant');

const DepartmentManagementRoute = require('./department-management.route');
const ServiceEventsController = require('../controllers/service-events.controller');

const routes = function (app) {
    app.use(
        `/department`,
        verifyAccessTokenMiddleware,
        verifyRoleMiddleware([ROLE_NAME_DIRECTOR]),
        DepartmentManagementRoute,
    );

    app.use(`/service-events`, verifyServiceAPIKeyMiddleware, ServiceEventsController);
};

module.exports = routes;
