const jwt = require('jsonwebtoken');

const { SECRET_KEY_ACCESS_TOKEN, SECRET_KEY_REFRESH_TOKEN } = process.env;

const signAccessToken = async (payload) => {
    return new Promise((resolve, reject) => {
        // Access token only valid in 1 weeks
        const options = {
            expiresIn: '1w',
        };

        jwt.sign(payload, SECRET_KEY_ACCESS_TOKEN, options, (err, token) => {
            if (err) {
                reject(err);
            }

            resolve(token);
        });
    });
};

const signRefreshToken = async (data) => {
    return new Promise((resolve, reject) => {
        const options = {
            expiresIn: '1y',
        };

        jwt.sign(data, SECRET_KEY_REFRESH_TOKEN, options, (err, token) => {
            if (err) reject(err);

            resolve(token);
        });
    });
};

const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, SECRET_KEY_REFRESH_TOKEN, (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
};
