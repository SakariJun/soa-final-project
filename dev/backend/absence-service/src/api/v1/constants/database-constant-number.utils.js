exports.ACCOUNT_STATE_WAITING_VERIFY = 0; // Chờ xác minh
exports.ACCOUNT_STATE_VERIFIED = 1; // Đã xác minh
exports.ACCOUNT_STATE_DISABLE = 2; // Đã vô hiệu hóa
exports.ACCOUNT_STATE_WAITING_UPDATE = 3; // Chờ cập nhật

exports.ACCOUNT_ROLE_USER = 0; // Quyền User 
exports.ACCOUNT_ROLE_ADMIN = 1; // Quyền Admin

exports.ACCOUNT_ROLE_NOT_CHANGE_PASSWORD_FIRST_TIME = 0; // Chưa đổi mật khẩu lần đầu
exports.ACCOUNT_ROLE_IS_CHANGE_PASSWORD_FIRST_TIME = 1; // Đã đổi mật khẩu lần đầu

exports.ACCOUNT_NOT_BANNED = 0; // Không khóa
exports.ACCOUNT_IS_BANNED = 1; // Khóa

exports.TRANSACTION_TYPE_RECHARGE_MONEY = 0; // Nạp tiền
exports.TRANSACTION_TYPE_WITHDRAW_MONEY = 1; // Rút tiền
exports.TRANSACTION_TYPE_TRANSFER_MONEY = 2; // Chuyển tiền
exports.TRANSACTION_TYPE_RECEIVE_MONEY = 3; // Nhận tiền
exports.TRANSACTION_TYPE_SERVICE_PAYMENT = 4; // Thanh toán dịch vụ

exports.TRANSACTION_STATE_SUCCESS = 0; // Giao dịch thành công
exports.TRANSACTION_STATE_WAITING = 1; // Chờ duyệt
exports.TRANSACTION_STATE_FAIL = 2; // Bị hủy