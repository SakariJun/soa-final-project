const { getAbsenceInformation } = require('../services/absence.service');

const GetAbsenceInformationController = async (req, res, next) => {
    try {
        const { status, message, data } = await getAbsenceInformation(req.payload);

        if (!status) {
            return res.status(202).json({ status, message, data });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {
    GetAbsenceInformationController,
};
