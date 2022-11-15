const router = require('express').Router();

const adminTransferManagementController = require('../controllers/admin-transfer-management.controller');

router.get('/user/:id', adminTransferManagementController.getMonthlyTransferByUserController);

router.get('/transfer-waiting', adminTransferManagementController.getAllWaitingTransferController);

router.get('/transfer-waiting/user/:id', adminTransferManagementController.getAllWaitingTransferByUserController);

router.get('/transfer-waiting/:id', adminTransferManagementController.getAllWaitingTransferController);

router.put('/transfer-waiting/:id/approve', adminTransferManagementController.updateTransferStateController);

router.put('/transfer-waiting/:id/reject', adminTransferManagementController.updateTransferStateController);

module.exports = router