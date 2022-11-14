const { verifyAccessTokenMiddleware } = require('../middlewares/jwt.middleware');

const otpRoute = require('./otp.route');
const userRoute = require('./user.route');
const tuitionRoute = require('./tuition.route');

const routes = function (app) {
    const PREFIX = '/api/v1/i-banking';

    app.use(`${PREFIX}/user`, userRoute);
    app.use(`${PREFIX}/otp`, verifyAccessTokenMiddleware, otpRoute);
    app.use(`${PREFIX}/tuition`, verifyAccessTokenMiddleware, tuitionRoute);
};

module.exports = routes;
