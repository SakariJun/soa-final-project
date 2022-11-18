const { verifyAccessTokenMiddleware, verifyRoleMiddleware, verifyServiceAPIKeyMiddleware } = require('../middlewares');

const ServiceEventsController = require('../controllers/service-events.controller');

const routes = function (app) {
    app.use(`/service-events`, verifyServiceAPIKeyMiddleware, ServiceEventsController);
};

module.exports = routes;
