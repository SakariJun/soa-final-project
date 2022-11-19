const {
    SERVICE_USER_EVENTS_GET_ROLE_BY_USER_ID,
    SERVICE_USER_EVENTS_SET_ROLE_BY_USER_ID,
    SERVICE_USER_EVENTS_GET_USERS_ID_BY_ROLE_NAME,
    SERVICE_USER_EVENTS_GET_USERS_ID_BY_DEPARTMENT_ID,
} = require('../constants/global.constant');

const { updateUserRole, getAllUserIDByRoleName, getAllUserIDByDepartment } = require('./user-admin.service');
const { getUserInformation } = require('./user.service');

// Hàm này có nhiệm vụ
// Nhận loại sự kiện cần xử lý
// Data từ Service gửi đến.
// Sau khi xử lý sẽ trả về kết quả cho Service gọi đến
const SubscribeEvents = async function ({ event, data }) {
    try {
        switch (event) {
            case SERVICE_USER_EVENTS_GET_ROLE_BY_USER_ID:
                const result = await getUserInformation(data);
                if (result.status) {
                    result.data = result.data.role_id.name;
                }
                return result;
            case SERVICE_USER_EVENTS_SET_ROLE_BY_USER_ID:
                return await updateUserRole(data);
            case SERVICE_USER_EVENTS_GET_USERS_ID_BY_ROLE_NAME:
                return await getAllUserIDByRoleName(data);
            case SERVICE_USER_EVENTS_GET_USERS_ID_BY_DEPARTMENT_ID:
                return await getAllUserIDByDepartment(data);
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
