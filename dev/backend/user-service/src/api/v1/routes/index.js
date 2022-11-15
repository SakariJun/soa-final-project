const { verifyAccessTokenMiddleware } = require('../middlewares/jwt.middleware');

const userRoute = require('./user.route');

const routes = function (app) {
    const PREFIX = '/api/v1/employee-management';

    app.use(`${PREFIX}/user`, userRoute);
};

module.exports = routes;
