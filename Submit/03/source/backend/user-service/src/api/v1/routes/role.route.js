const router = require('express').Router();

const roleController = require('../controllers/role.controller');

router.get('/get-all-role', roleController.GetAllRoleController);

module.exports = router;
