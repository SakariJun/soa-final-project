const router = require('express').Router();

const adminAccountManagementController = require('../controllers/admin-account-management.controller');
const adminAccountManagementValidator = require('../validators/admin-account-mangement.validator');

router.get('/get-accounts-by-state/:state', adminAccountManagementValidator.validatorState, adminAccountManagementController.getUserAccountsByStateController);

router.get('/get-banned-accounts', adminAccountManagementController.getBannedUserAccountsController);

router.put('/update-account-state', adminAccountManagementValidator.validatorUpdateState, adminAccountManagementController.updateUserAccountStateController);

router.put('/unbanned-account', adminAccountManagementValidator.validatorUnbannedAccount, adminAccountManagementController.unbannedAccountController);

module.exports = router
