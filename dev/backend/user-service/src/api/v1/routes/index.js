const { verifyAccessTokenMiddleware } = require('../middlewares');

const userRoute = require('./user.route');
const userAdminRoute = require('./user-admin.route');

const routes = function (app) {
    const PREFIX = '/api/v1/employee-management';

    app.use(`${PREFIX}/user`, userRoute);
    app.use(`${PREFIX}/user-admin`, verifyAccessTokenMiddleware, userAdminRoute);
};

module.exports = routes;
