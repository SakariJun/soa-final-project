module.exports = {
    verifyAccessTokenMiddleware: require('./jwt.middleware'),
    verifyRoleMiddleware: require('./authorization-role.middleware'),
    verifyIsActiveMiddleware: require('./verify-is-active.middleware'),
    verifyServiceAPIKeyMiddleware: require('./verify-service-api-key.middleware'),
};
