const router = require('express').Router();
const tuitionController = require('../controllers/tuition.controller');

router.get('/get-tuitions', tuitionController.getTuitionsController);
router.post('/create-tuition', tuitionController.createTuitionController);
router.post('/validate-tuition', tuitionController.validateTuitionController);

module.exports = router;
