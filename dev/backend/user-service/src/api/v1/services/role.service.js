const { _Role } = require('../models');

const getAllRole = async function () {
    try {
        const role = await _Role.find().lean();

        return {
            status: true,
            message: 'Lấy danh sách role thành công !',
            data: role,
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    getAllRole,
};
