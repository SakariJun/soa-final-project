const createError = require('http-errors');
const jwt = require('jsonwebtoken');

// Place this middle before router middleware to validate Accesstoken
const verifyAccessTokenMiddleware = (req, res, next) => {
    // Check if the request is called by AJAX - Fetch and expect to receive JSON Response
    // const isJSONAccept = req.headers['accept'] === 'application/json'
    isJSONAccept = true; // Tạm vô hiệu hóa chức năng check header

    let accessToken = ''

    if (isJSONAccept) {
        // If the request is called by AJAX - Fetch then AccessToken must be set in Header: Authorization
        if (!req.headers['authorization']) {
            return next(createError.Unauthorized())
        }

        const authHeader = req.headers['authorization']
        const tokenParts = authHeader.split(' ')

        const preTokenPart = tokenParts[0]
        accessToken = tokenParts[1]

        if (preTokenPart !== 'Bearer' && accessToken.match(/\$+\.\$+\.\$+/) !== null) {
            return next(createError.Unauthorized('Invalid authorization token format'))
        }
    } else {
        // If the request is called by browser then AccessToken must be set in cookies
        accessToken = req.cookies.accessToken

        if (!accessToken) {
            return next(createError.Unauthorized())
        }

        if (accessToken.match(/\$+\.\$+\.\$+/) !== null) {
            return next(createError.Unauthorized('Invalid authorization token format'))
        }
    }

    const secretKey = process.env.SECRET_KEY_ACCESS_TOKEN
    jwt.verify(accessToken, secretKey, (err, payload) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return isJSONAccept ?
                    res.status(401).json({ status: 'false', message: err.message }) :
                    next(createError.Unauthorized(err.message))
            } else if (err.name === 'JsonWebTokenError') {
                return isJSONAccept ?
                    res.status(401).json({ status: 'false', message: err.message }) :
                    next(createError.Unauthorized())
            } else {
                return isJSONAccept ?
                    res.status(401).json({ status: 'false', message: err.message }) :
                    next(createError.Unauthorized())
            }
        }

        req.payload = payload;
        next();
    })
}

module.exports = { verifyAccessTokenMiddleware }