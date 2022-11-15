const { verifyRoleMiddleware } = require('../middlewares/authorization-role.middleware');

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

module.exports = router;
