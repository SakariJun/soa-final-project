const { verifyOTP } = require('../services/otp.service');

const VerifyOTPController = async function (req, res, next) {
    try {
        const { status, message, data } = await verifyOTP(req.payload, req.body);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {
    VerifyOTPController,
};
