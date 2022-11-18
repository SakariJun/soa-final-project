const { _Absence, _AbsenceRequest } = require('../models');

const {
    ROLE_NAME_LEADER,
    ROLE_NAME_EMPLOYEE,

    MAX_ABSENCE_DAY_LEADER,
    MAX_ABSENCE_DAY_EMPLOYEE,
    ABSENCE_REQUEST_STATE_WAITING,
    ABSENCE_REQUEST_STATE_APPROVED,
    ABSENCE_REQUEST_STATE_REFUSED,
} = require('../constants/global.constant');

const createAbsenceRequest = async function ({ user_id }, { date_begin, date_end, reason }) {
    try {
        const absence = await _Absence.findOne({ user_id });

        if (!absence) {
            return {
                status: false,
                message: `Không thể tạo yêu cầu nghỉ phép do không tìm thấy thông tin nghỉ phép của nhân viên ${user_id}!`,
            };
        }

        date_begin = new Date(date_begin);
        date_end = new Date(date_end);

        if (date_begin.getTime() <= date_end.getTime()) {
        }

        const absenceRequest = await _AbsenceRequest.create({ user_id, date_begin, date_end, reason });
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};
