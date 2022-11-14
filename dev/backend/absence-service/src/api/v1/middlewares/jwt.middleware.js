const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const verifyAccessTokenMiddleware = async (req, res, next) => {
    let accessToken = '';

    if (!req.cookies.accessToken && !req.headers['authorization']) {
        return next(createError.Unauthorized());
    }

    accessToken = req.cookies.accessToken || req.headers['authorization'];

    if (!accessToken) {
        return next(createError.Unauthorized());
    }

    console.log('🚀 ~ file: jwt.middleware.js ~ line 18 ~ verifyAccessTokenMiddleware ~ req.cookies', req.cookies);

    if (accessToken.includes('Bearer')) {
        accessToken = accessToken.split(' ')[1];
    }

    if (accessToken.match(/\$+\.\$+\.\$+/) !== null) {
        return next(createError.Unauthorized('Invalid authorization token format'));
    }

    const secretAccessTokenKey = process.env.SECRET_KEY_ACCESS_TOKEN;

    jwt.verify(accessToken, secretAccessTokenKey, (err, payload) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                // Check this error code -> Use refresh token to get new access token
                return res.status(401).json({ status: 'false', message: err.message });
            }

            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ status: 'false', message: err.message });
            }

            return res.status(401).json({ status: 'false', message: err.message });
        }

        req.payload = payload;
        next();
    });
};

module.exports = {
    verifyAccessTokenMiddleware,
};
