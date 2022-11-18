// Server này đóng vai trò làm API gateway
// Chịu trách nhiệm nhận các request từ client
// Sau đó redirect những request này tới các service tương ứng
const proxy = require('express-http-proxy');

const routes = function (app) {
    const PREFIX = '/api/v1/i-banking';

    app.use(`${PREFIX}/user`, proxy(process.env.USER_SERVICE));
    app.use(`${PREFIX}/tuition-payment`, proxy(process.env.TUITION_PAYMENT_SERVICE));
};

module.exports = routes;
