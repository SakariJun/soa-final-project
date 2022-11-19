const { SERVICE_DEPARTMENT_EVENT_GET_DEPARTMENT_BY_DEPARTMENT_ID } = require('../constants/global.constant');

const { getDepartmentDetail } = require('../services/department-management.service');
// Hàm này có nhiệm vụ
// Nhận loại sự kiện cần xử lý
// Data từ Service gửi đến.
// Sau khi xử lý sẽ trả về kết quả cho Service gọi đến

const SubscribeEvents = async function ({ event, data }) {
    try {
        switch (event) {
            case SERVICE_DEPARTMENT_EVENT_GET_DEPARTMENT_BY_DEPARTMENT_ID:
                return await getDepartmentDetail(data);
            default:
                return {
                    status: false,
                    message: 'Invalid event !',
                };
        }
    } catch (error) {
        console.log(error);
        return { status: false, message: error.message };
    }
};

module.exports = SubscribeEvents;
