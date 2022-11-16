const verifyServiceAPIKeyMiddleware = (req, res, next) => {
    console.log('VERIFY API KEY');

    // TODO: Implement cơ chế bảo mật Service API
    next();
};

module.exports = verifyServiceAPIKeyMiddleware;
