const {
    SERVICE_ABSENCE_EVENTS_CREATE_ABSENCE_INFORMATION,
    SERVICE_ABSENCE_EVENTS_UPDATE_ABSENCE_INFORMATION,
} = require('../constants/global.constant');

const { createAbsenceInformation, updateAbsenceInformation } = require('./absence.service');

// Hàm này có nhiệm vụ
// Nhận loại sự kiện cần xử lý
// Data từ Service gửi đến.
// Sau khi xử lý sẽ trả về kết quả cho Service gọi đến
const SubscribeEvents = async function ({ event, data }) {
    try {
        switch (event) {
            case SERVICE_ABSENCE_EVENTS_CREATE_ABSENCE_INFORMATION:
                return await createAbsenceInformation(data);
            case SERVICE_ABSENCE_EVENTS_UPDATE_ABSENCE_INFORMATION:
                return await updateAbsenceInformation(data);
            default:
                return {
                    status: false,
                    message: 'Event không hợp lệ!',
                };
        }
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = SubscribeEvents;
