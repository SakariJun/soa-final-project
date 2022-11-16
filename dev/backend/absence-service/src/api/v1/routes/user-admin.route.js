const { addUserValidator } = require('../validators');

const router = require('express').Router();
const userAdminController = require('../controllers/user-admin.controller');

router.post('/add-user', addUserValidator, userAdminController.AddUserController);

router.post('/reset-password', userAdminController.ResetPasswordController);

router.get('/get-all-users', userAdminController.GetAllUsersController);

router.get('/get-user-detail', userAdminController.GetUserDetailController);

module.exports = router;
