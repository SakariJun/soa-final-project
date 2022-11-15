const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const {
    ID_DIGITS,
    ROLE_NAME_LEADER,
    MAX_ABSENCE_DAY_LEADER,
    MAX_ABSENCE_DAY_EMPLOYEE,
} = require('../constants/global.constant');
const { createNewIDWithOutPrefix } = require('../utils/generate-prefix-id.util');

const { _User, _Role } = require('../models');

async function validateAddUser(req) {
    const validateResult = validationResult(req);

    if (!validateResult.isEmpty()) {
        return { status: false, message: validateResult.errors[0].msg };
    }

    const { email, phone_number } = req.body;

    const checkDuplicateInformation = await _User
        .findOne({
            $or: [
                {
                    email: email,
                },
                {
                    phone_number: phone_number,
                },
            ],
        })
        .lean();

    console.log(
        '🚀 ~ file: user.service.js ~ line 36 ~ validateAddUser ~ checkDuplicateInformation',
        checkDuplicateInformation,
    );

    if (checkDuplicateInformation) {
        if (checkDuplicateInformation.email === email) {
            return { status: false, message: 'Địa chỉ email đã tồn tại!' };
        }

        if (checkDuplicateInformation.phone_number === phone_number) {
            return { status: false, message: 'Số điện thoại đã tồn tại!' };
        }
    }

    return { status: true };
}

const generateUniqueUserID = async function (department_id) {
    let maxCurrentID = await _User.find({ department_id }).sort('-user_id').limit(1).lean();

    if (maxCurrentID.length === 0) {
        maxCurrentID = ''.padStart(ID_DIGITS, '0');
    } else {
        maxCurrentID = maxCurrentID[0].user_id;
        maxCurrentID = maxCurrentID.substring(maxCurrentID.length - ID_DIGITS, maxCurrentID.length);
    }

    maxCurrentID = createNewIDWithOutPrefix(maxCurrentID);

    const department_index = parseInt(department_id.substring(department_id.length - ID_DIGITS, department_id.length));

    const twoLastDigitFromYear = new Date().getFullYear().toString().substr(-2);

    return `${department_index}${twoLastDigitFromYear}${maxCurrentID}`;
};

const addUser = async function ({
    full_name,
    phone_number,
    email,
    day_of_birth,
    gender,
    department_id = 'PB00000',
    role_name,
}) {
    try {
        const role = await _Role.findOne({ name: role_name }).lean();

        if (!role) {
            return { status: false, message: 'Không tìm thấy chức vụ tương ứng!' };
        }

        const user_id = await generateUniqueUserID(department_id);

        const hashedPassword = await bcrypt.hash(user_id, 10);

        const user = await _User.create({
            user_id,
            full_name,
            phone_number,
            email,
            day_of_birth,
            department_id,
            role_id: role._id,
            gender,
            account: {
                username: user_id,
                password: hashedPassword,
            },
            absence: {
                max_absence_day: role.name === ROLE_NAME_LEADER ? MAX_ABSENCE_DAY_LEADER : MAX_ABSENCE_DAY_EMPLOYEE,
            },
        });

        return {
            status: true,
            message: 'Thêm nhân viên thành công! Tên tài khoản và mật khẩu mặc định là [Mã số nhân viên]!',
            data: user,
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    validateAddUser,
    addUser,
};
