const { createTuition, getTuitions, validateTuition } = require('../services/tuition.service');

const createTuitionController = async function (req, res, next) {
    try {
        const { status, message, data } = await createTuition(req.body);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status, message, data });
    }
};

const getTuitionsController = async function (req, res, next) {
    try {
        const { status, message, data } = await getTuitions(req.query);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status, message, data });
    }
};

const validateTuitionController = async function (req, res, next) {
    try {
        const { status, message, data } = await validateTuition(req.payload, req.body);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status, message, data });
    }
};

module.exports = {
    createTuitionController,
    getTuitionsController,
    validateTuitionController,
};
