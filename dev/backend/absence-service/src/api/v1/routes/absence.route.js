const router = require('express').Router();

const absenceController = require('../controllers/absence.controller');

// Lấy thông tin nghỉ phép của bản thân
router.get('/get-absence-information', absenceController.GetAbsenceInformationController);

module.exports = router;
