const { getAllRole } = require('../services/role.service');

const GetAllRoleController = async function (req, res, next) {
    try {
        const { status, message, data } = await getAllRole(req.payload);

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
    GetAllRoleController,
};
