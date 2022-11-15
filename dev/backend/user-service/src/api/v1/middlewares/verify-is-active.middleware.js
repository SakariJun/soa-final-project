const verifyIsActiveMiddleware = (active) => {
    return (req, res, next) => {
        let message = '';

        if (active) {
            message = 'Vui lòng đổi mật khẩu mặc định trước khi sử dụng tính năng này!';
        } else {
            message = 'Bạn đã đổi mật khẩu mặc định rồi! Không thể sử dụng tính năng này!';
        }

        if (req.payload.is_activate !== active) {
            return res.status(403).json({ status: 'false', message });
        }

        next();
    };
};

module.exports = verifyIsActiveMiddleware;
