const router = require('express').Router();

const { addUserValidator } = require('../validators');
const userAdminController = require('../controllers/user-admin.controller');

router.post('/add-user', addUserValidator, userAdminController.AddUserController);

router.post('/reset-password', userAdminController.ResetPasswordController);

// Giám đốc lấy danh sách thông tin nhân viên
router.get('/get-all-users', userAdminController.GetAllUsersController);

// Lấy chi tiết thông tin nhân viên bao gồm thông tin nghỉ phép + thông tin phòng ban
router.get('/get-user-detail', userAdminController.GetUserDetailController);

// Cập nhật lương nhân viên
router.put('/update-user-salary', userAdminController.UpdateUserSalaryController);

module.exports = router;
