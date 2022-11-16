const {
    SERVICE_USER_EVENTS_GET_ROLE_BY_USER_ID,
    SERVICE_USER_EVENTS_SET_ROLE_BY_USER_ID,
} = require('../constants/global.constant');

// Hàm này có nhiệm vụ
// Nhận loại sự kiện cần xử lý
// Data từ Service gửi đến.
// Sau khi xử lý sẽ trả về kết quả cho Service gọi đến

const SubscribeEvents = async function ({ event, data }) {
    try {
        switch (event) {
            case SERVICE_USER_EVENTS_GET_ROLE_BY_USER_ID:
                return;
            case SERVICE_USER_EVENTS_SET_ROLE_BY_USER_ID:
                return;
            default:
                return {
                    status: false,
                    message: 'Invalid event !',
                };
        }
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = SubscribeEvents;
