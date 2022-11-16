// Hàm này có nhiệm vụ
// Nhận loại sự kiện cần xử lý
// Data từ Service gửi đến.
// Sau khi xử lý sẽ trả về kết quả cho Service gọi đến

const SubscribeEvents = async function ({ event, data }) {
    try {
        switch (event) {
            case 1:
                return;
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
