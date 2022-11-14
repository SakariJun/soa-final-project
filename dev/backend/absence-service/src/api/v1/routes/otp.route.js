const expressQueue = require('express-queue');

const router = require('express').Router();
const otpController = require('../controllers/otp.controller');

// activeLimit - max request to process simultaneously
// queuedLimit - max requests in queue until reject (-1 means do not reject)
// rejectHandler - handler to call when queuedLimit is reached (see below)
const queueMiddleware = expressQueue({
    activeLimit: 1,
    queuedLimit: 10,
    rejectHandler: (req, res) => {
        res.status(500).json({
            status: false,
            message: 'Hệ thống đang quá tải! Vui lòng thử lại sau ít phút!',
        });
    },
});

router.post('/verify-otp', queueMiddleware, otpController.VerifyOTPController);

module.exports = router;
