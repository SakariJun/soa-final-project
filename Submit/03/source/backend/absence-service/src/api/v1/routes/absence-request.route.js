const router = require('express').Router();
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5242880 },
});

const { verifyRoleMiddleware } = require('../middlewares');
const { ROLE_NAME_DIRECTOR, ROLE_NAME_LEADER, ROLE_NAME_EMPLOYEE } = require('../constants/global.constant');

const absenceRequestController = require('../controllers/absence-request.controller');

// Giám đốc, trưởng phòng lấy danh sách đơn xin nghỉ phép của cấp dưới
router.get('/get-all-user-absence-today', absenceRequestController.GetAllUserAbsenceTodayController);

// Tạo đơn xin nghỉ phép
router.post(
    '/create-absence-request',
    verifyRoleMiddleware([ROLE_NAME_EMPLOYEE, ROLE_NAME_LEADER]),
    upload.any('absence_request_files'),
    absenceRequestController.CreateAbsenceRequestController,
);

// Giám đốc, trưởng phòng lấy danh sách đơn xin nghỉ phép của cấp dưới
router.get(
    '/get-all-absence-request-by-manager',
    verifyRoleMiddleware([ROLE_NAME_DIRECTOR, ROLE_NAME_LEADER]),
    absenceRequestController.GetAllAbsenceByManagerRequestController,
);

// Người lao động lấy danh sách nghỉ phép của mình
router.get('/get-all-absence-request-by-employee', absenceRequestController.GetAllAbsenceRequestByEmployeeController);

// Giám đốc, trưởng phòng xem chi tiết đơn xin nghỉ phép
router.get(
    '/get-absence-request-detail',
    verifyRoleMiddleware([ROLE_NAME_DIRECTOR, ROLE_NAME_LEADER]),
    absenceRequestController.GetAbsenceRequestDetailController,
);

// Giám đốc, trưởng phòng duyệt đơn xin nghỉ phép
router.put(
    '/update-absence-request-state',
    verifyRoleMiddleware([ROLE_NAME_DIRECTOR, ROLE_NAME_LEADER]),
    absenceRequestController.UpdateAbsenceRequestStateController,
);

module.exports = router;
