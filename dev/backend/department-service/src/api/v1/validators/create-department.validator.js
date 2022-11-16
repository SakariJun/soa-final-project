const { check } = require('express-validator');

const createDepartmentValidator = [
    check('room').notEmpty().withMessage('Vui lòng điền thông tin phòng của phòng ban!'),

    check('name').notEmpty().withMessage('Vui lòng điền tên phòng ban!'),

    check('description').notEmpty().withMessage('Vui lòng điền thông tin mô tả phòng ban!'),
];

module.exports = createDepartmentValidator;
