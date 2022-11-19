const { check } = require('express-validator')

const rechargeMoneyValidator = [
    check('card_number')
    .notEmpty()
    .withMessage('Vui lòng nhập số thẻ tín dụng !').trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('Số thẻ tín dụng phải đúng 6 ký tự !'),

    check('day_expiry_date')
    .notEmpty()
    .withMessage('Vui lòng chọn ngày hết hạn thẻ').trim()
    .isInt({ min: 1, max: 31 })
    .withMessage('Giá trị ngày hết hạn thẻ phải nằm trong khoảng 1 đến 31'),

    check('month_expiry_date')
    .notEmpty()
    .withMessage('Vui lòng chọn tháng hết hạn thẻ').trim()
    .isInt({ min: 1, max: 12 })
    .withMessage('Giá trị tháng hết hạn thẻ phải nằm trong khoảng 1 đến 12'), // Warning trong JS date month hay bắt đầu từ 0 -> 11

    check('year_expiry_date')
    .notEmpty()
    .withMessage('Vui lòng chọn năm hết hạn thẻ').trim()
    .isInt({ min: 1800, max: 2022 })
    .withMessage('Giá trị năm hết hạn thẻ phải nằm trong khoảng 1800 đến 2022'),

    check('cvv_code')
    .notEmpty()
    .withMessage('Vui lòng nhập mã CVV !')
    .isLength({ min: 3, max: 3 })
    .withMessage('Mã CVV phải đúng 3 ký tự !'),

    check('recharge_amount')
    .notEmpty()
    .withMessage('Vui lòng nhập số tiền cần nạp !')
    .isInt({ min: 1 })
    .withMessage('Số tiền cần nạp phải lớn hơn 0'),
];

const withdrawMoneyValidator = [
    check('card_number')
    .notEmpty()
    .withMessage('Vui lòng nhập số thẻ tín dụng !').trim()
    .isLength({ min: 6, max: 6 })
    .withMessage('Số thẻ tín dụng phải đúng 6 ký tự !'),

    check('day_expiry_date')
    .notEmpty()
    .withMessage('Vui lòng chọn ngày hết hạn thẻ').trim()
    .isInt({ min: 1, max: 31 })
    .withMessage('Giá trị ngày hết hạn thẻ phải nằm trong khoảng 1 đến 31'),

    check('month_expiry_date')
    .notEmpty()
    .withMessage('Vui lòng chọn tháng hết hạn thẻ').trim()
    .isInt({ min: 1, max: 12 })
    .withMessage('Giá trị tháng hết hạn thẻ phải nằm trong khoảng 1 đến 12'), // Warning trong JS date month hay bắt đầu từ 0 -> 11

    check('year_expiry_date')
    .notEmpty()
    .withMessage('Vui lòng chọn năm hết hạn thẻ').trim()
    .isInt({ min: 1800, max: 2022 })
    .withMessage('Giá trị năm hết hạn thẻ phải nằm trong khoảng 1800 đến 2022'),

    check('cvv_code')
    .notEmpty()
    .withMessage('Vui lòng nhập mã CVV !')
    .isLength({ min: 3, max: 3 })
    .withMessage('Mã CVV phải đúng 3 ký tự !'),

    check('amount')
    .notEmpty()
    .withMessage('Vui lòng nhập số tiền muốn rút')
    .isInt({ min: 50000 })
    .withMessage('Số tiền muốn rút phải lớn hơn 50000'),
]

const transferMoneyValidator = [
    check('send-to')
    .notEmpty()
    .withMessage('Vui lòng nhập số điện thoại người nhận').trim()
    .isLength({ min: 10, max: 11 })
    .withMessage('Số điện thoại không hợp lệ'),

    check('amount')
    .notEmpty()
    .withMessage('Vui lòng nhập số tiền muốn chuyển')
    .isInt({ min: 10000 })
    .withMessage('Số tiền muốn chuyển phải lớn hơn 10000'),

    check('tax-pay-by')
    .notEmpty()
    .withMessage('Vui lòng chọn bên chịu phí chuyển tiền.')
    .isInt({ min: 0, max: 1 }) // 0 là bên chuyển, 1 là bên nhận
    .withMessage('Lựa chọn bên chịu phí không hợp lệ'),
]

const verifyTransferMoneyOTP = [
    check('OTP')
    .notEmpty()
    .withMessage('Vui lòng nhập mã OTP')
]

const servicePaymentValidator = [
    check('network-operator-name')
    .notEmpty()
    .withMessage('Vui lòng chọn nhà mạng').trim(),

    check('phone-card-quantity')
    .notEmpty()
    .withMessage('Vui lòng nhập số thẻ muốn mua')
    .isInt({ min: 1, max: 5 })
    .withMessage('Chỉ được mua từ 1-5 thẻ /lần'),

    check('phone-card-value')
    .notEmpty()
    .withMessage('Vui lòng chọn mệnh giá thẻ')
]

module.exports = {
    rechargeMoneyValidator,
    withdrawMoneyValidator,
    transferMoneyValidator,
    verifyTransferMoneyOTP,
    servicePaymentValidator
}