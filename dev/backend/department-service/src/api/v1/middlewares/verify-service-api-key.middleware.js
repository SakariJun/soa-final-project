const verifyServiceAPIKeyMiddleware = (req, res, next) => {
    // TODO: Implement cơ chế bảo mật Service API
    next();
};

module.exports = verifyServiceAPIKeyMiddleware;
