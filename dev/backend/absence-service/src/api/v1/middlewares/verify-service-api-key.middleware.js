const verifyServiceAPIKeyMiddleware = (req, res, next) => {
    // TODO: Implement cơ chế bảo mật Service API
    console.error('Validate API KEY');
    next();
};

module.exports = verifyServiceAPIKeyMiddleware;
