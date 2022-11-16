const { _Department } = require('../models');

const { ID_DIGITS } = require('../constants/global.constant');
const { createNewIDWithOutPrefix } = require('../utils/generate-prefix-id.util');

const createDepartment = async function ({ name, room, leader_id, description }) {
    try {
        if (leader_id) {
            // TODO: Check xem hiện tại leader_id có đang làm trưởng phòng của phòng ban nào không
            // Nếu có thì báo lỗi
            // TODO: Nếu leader_id tồn tại thì gọi sang UserService để check mã nhân viên
            // Và chuyển role sang Trưởng phòng
        }

        let maxCurrentID = await _Department.find().sort('-department_id').limit(1).lean();

        // Nếu chưa có phòng ban nào thì mã phòng ban là PB00000
        if (maxCurrentID.length === 0) {
            maxCurrentID = 'PB'.padEnd(ID_DIGITS, '0');
        } else {
            // Nếu đã có phòng ban rồi thì lấy PB + Mã cao nhất hiện tại
            // VD: PB00004
            maxCurrentID = maxCurrentID[0].department_id;
            maxCurrentID = 'PB' + maxCurrentID.substring(maxCurrentID.length - ID_DIGITS, maxCurrentID.length);
        }

        maxCurrentID = createNewIDWithOutPrefix(maxCurrentID);

        const department = await _Department.create({
            department_id: maxCurrentID,
            name,
            room,
            leader_id,
            description,
        });

        if (!department) {
            return { status: false, message: 'Tạo phòng ban không thành công!' };
        }

        // TODO: Tạo thành công department => Gọi qua User Service set Role cho nhân viên
        // Thành trưởng phòng (nếu có)
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getAllDepartments = async function () {
    try {
        const departments = await _Department.find().lean();

        return { status: true, message: 'Lấy danh sách phòng ban thành công!', data: departments };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const updateDepartment = async function () {
    try {
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const deleteDepartment = async function () {
    try {
        const deletedDepartment = await _Department.deleteOne({ department_id }).lean();

        // TODO: Gọi service User để set role của trưởng phòng về nhân viên
        if (!deletedDepartment) {
            return { status: false, message: 'Xóa phòng ban không thành công!' };
        }
        return { status: true, message: 'Lấy danh sách phòng ban thành công!', data: departments };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const assignLeaderDepartment = async function ({ leader_id, department_id }) {
    try {
        // TODO: Gọi sang service khác để kiểm tra
        // leader_id hiện tại có tồn tại và đang làm trưởng phòng hay không

        const department = await _Department.findOneAndUpdate(
            {
                department_id,
            },
            {
                leader_id,
            },
            {
                new: true,
            },
        );
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const removeLeaderDepartment = async function () {
    try {
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    createDepartment,
    getAllDepartments,
    updateDepartment,
    deleteDepartment,
    assignLeaderDepartment,
    removeLeaderDepartment,
};
