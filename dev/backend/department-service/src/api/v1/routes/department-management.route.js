const { createDepartmentValidator } = require('../validators');

const router = require('express').Router();
const departmentController = require('../controllers/department-management.controller');

// CRUD Phòng ban
router.get('/get-all-departments', departmentController.GetAllDepartmentsController);
router.get('/get-department-detail', departmentController.GetDepartmentDetailController);
router.delete('/delete-department', departmentController.DeleteDepartmentController);
router.post('/create-department', createDepartmentValidator, departmentController.CreateDepartmentController);
router.put('/update-department', createDepartmentValidator, departmentController.UpdateDepartmentController);

router.put('/assign-leader-department', departmentController.AssignLeaderDepartmentController);
router.put('/remove-leader-department', departmentController.RemoveLeaderDepartmentController);

module.exports = router;
