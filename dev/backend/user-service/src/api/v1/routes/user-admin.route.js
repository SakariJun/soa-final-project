const { verifyRoleMiddleware } = require('../middlewares');

const { addUserValidator } = require('../validators');
const { ROLE_NAME_DIRECTOR } = require('../constants/global.constant');

const router = require('express').Router();
const userAdminController = require('../controllers/user-admin.controller');

router.post(
    '/add-user',
    verifyRoleMiddleware([ROLE_NAME_DIRECTOR]),
    addUserValidator,
    userAdminController.AddUserController,
);

router.post('/reset-password', verifyRoleMiddleware([ROLE_NAME_DIRECTOR]), userAdminController.ResetPasswordController);

module.exports = router;
