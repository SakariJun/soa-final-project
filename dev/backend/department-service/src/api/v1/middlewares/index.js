module.exports = {
    verifyIsActiveMiddleware: require('./verify-is-active.middleware'),
    verifyAccessTokenMiddleware: require('./jwt.middleware'),
    verifyRoleMiddleware: require('./authorization-role.middleware'),
    verifyServiceAPIKeyMiddleware: require('./verify-service-api-key.middleware'),
};
