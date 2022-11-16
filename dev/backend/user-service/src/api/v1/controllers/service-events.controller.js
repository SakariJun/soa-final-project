const SubscribeEvents = require('../services/service-event.service');

// Controller Service Events
// Chịu trách nhiệm nhận request từ các service khác
// Tham số nhận vào là key: payload trong req.body
// Trong payload sẽ có 2 thuộc tính là:
// event: Đại diện cho event mà service khác cần Service hiện tại xử lý
// data: Chứa dữ liệu từ Service khác gửi đến
const ServiceEventsController = async (req, res, next) => {
    try {
        const { payload } = req.body;

        const { status, message, data } = await SubscribeEvents(payload);

        if (!status) {
            return res.status(202).json({ status, message, data });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = ServiceEventsController;
