const {
    verifyAccessTokenMiddleware,
    verifyIsActiveMiddleware,
    verifyServiceAPIKeyMiddleware,
} = require('../middlewares');
const absenceRoute = require('./absence.route');
const absenceRequestRoute = require('./absence-request.route');
const ServiceEventsController = require('../controllers/service-events.controller');

const routes = function (app) {
    app.use('/absence', verifyAccessTokenMiddleware, verifyIsActiveMiddleware(true), absenceRoute);
    app.use('/absence-request', verifyAccessTokenMiddleware, verifyIsActiveMiddleware(true), absenceRequestRoute);
    app.use(`/service-events`, verifyServiceAPIKeyMiddleware, ServiceEventsController);
};

module.exports = routes;
