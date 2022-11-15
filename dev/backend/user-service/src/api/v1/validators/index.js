const { changePasswordRequireValidator, changePasswordOptionalValidator } = require('./change-password.validator');

module.exports = {
    addUserValidator: require('./add-user.validator'),
    loginValidator: require('./login.validator'),
    changePasswordRequireValidator,
    changePasswordOptionalValidator,
    requestResetPasswordValidator: require('./request-reset-password.validator'),
};
