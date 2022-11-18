const {
    ROLE_NAME_DIRECTOR,
    ROLE_NAME_LEADER,
    ROLE_NAME_EMPLOYEE,
    MAX_ABSENCE_DAY_LEADER,
    MAX_ABSENCE_DAY_EMPLOYEE,
} = require('../constants/global.constant');
const { _Absence } = require('../models');

const maxAbsenceDay = {
    [ROLE_NAME_DIRECTOR]: -1,
    [ROLE_NAME_LEADER]: MAX_ABSENCE_DAY_LEADER,
    [ROLE_NAME_EMPLOYEE]: MAX_ABSENCE_DAY_EMPLOYEE,
};

const createAbsenceInformation = async function ({ user_id, role_name }) {
    try {
        let absence = await _Absence.findOne({ user_id }).lean();

        if (absence) {
            return { status: false, message: `Nhân viên ${user_id} đã có thông tin nghỉ phép rồi!` };
        }

        if (!maxAbsenceDay[role_name]) {
            return { status: false, message: 'Tên quyền không hợp lệ!' };
        }

        absence = await _Absence.create({ user_id, max_absence_day: maxAbsenceDay[role_name] });

        if (!absence) {
            return { status: false, message: 'Tạo thông tin nghỉ phép không thành công!' };
        }
        return { status: true, message: 'Tạo thông tin nghỉ phép thành công!' };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const updateAbsenceInformation = async function ({ user_id, role_name }) {
    try {
        let absence = await _Absence.findOne({ user_id });

        if (!absence) {
            return { status: false, message: `Không tìm thấy thông tin nghỉ phép của nhân viên ${user_id}!` };
        }

        if (!maxAbsenceDay[role_name]) {
            return { status: false, message: 'Tên quyền không hợp lệ!' };
        }

        absence.max_absence_day = maxAbsenceDay[role_name];
        await absence.save();

        return { status: true, message: 'Cập nhật số ngày nghỉ phép tối đa thành công!' };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getAbsenceInformation = async function ({ user_id }) {
    try {
        let absence = await _Absence.findOne({ user_id });

        if (!absence) {
            return { status: false, message: `Không tìm thấy thông tin nghỉ phép của nhân viên ${user_id}!` };
        }

        return { status: true, message: 'Lấy thông tin nghỉ phép thành công!', data: absence };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    createAbsenceInformation,
    updateAbsenceInformation,
    getAbsenceInformation,
};
