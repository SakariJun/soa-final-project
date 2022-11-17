const bcrypt = require('bcrypt');
const { startSession } = require('mongoose');
const { validationResult } = require('express-validator');

const {
    ID_DIGITS,
    ROLE_NAME_DIRECTOR,
    ROLE_NAME_LEADER,
    ROLE_NAME_EMPLOYEE,
    MAX_ABSENCE_DAY_LEADER,
    MAX_ABSENCE_DAY_EMPLOYEE,

    SERVICE_DEPARTMENT,
    SERVICE_DEPARTMENT_EVENT_GET_DEPARTMENT_BY_DEPARTMENT_ID,
} = require('../constants/global.constant');
const PublishServiceEvent = require('../utils/service-communicate.util');
const { createNewIDWithOutPrefix } = require('../utils/generate-prefix-id.util');

const { _User, _Role } = require('../models');

// #region Thêm nhân viên
async function validateAddUser(req) {
    try {
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

        if (checkDuplicateInformation) {
            if (checkDuplicateInformation.email === email) {
                return { status: false, message: 'Địa chỉ email đã tồn tại!' };
            }

            if (checkDuplicateInformation.phone_number === phone_number) {
                return { status: false, message: 'Số điện thoại đã tồn tại!' };
            }
        }

        return { status: true };
    } catch (error) {
        console.error(error.message);
        return { status: false, message: 'Có lỗi xảy ra trong quá trình kiểm tra đầu vào!' };
    }
}

const generateUniqueUserID = async function (department_id) {
    try {
        let maxCurrentID = await _User.find({ department_id }).sort('-user_id').limit(1).lean();

        if (maxCurrentID.length === 0) {
            maxCurrentID = ''.padStart(ID_DIGITS, '0');
        } else {
            maxCurrentID = maxCurrentID[0].user_id;
            maxCurrentID = maxCurrentID.substring(maxCurrentID.length - ID_DIGITS, maxCurrentID.length);
        }

        maxCurrentID = createNewIDWithOutPrefix(maxCurrentID);

        const department_index = parseInt(
            department_id.substring(department_id.length - ID_DIGITS, department_id.length),
        );

        const twoLastDigitFromYear = new Date().getFullYear().toString().substr(-2);

        return `${department_index}${twoLastDigitFromYear}${maxCurrentID}`;
    } catch (err) {
        console.error(err.message);
        return err.message;
    }
};

const addUser = async function ({ full_name, phone_number, email, day_of_birth, gender, department_id = 'PB00000' }) {
    try {
        const role = await _Role.findOne({ name: ROLE_NAME_EMPLOYEE }).lean();

        if (!role) {
            return { status: false, message: 'Không tìm thấy chức vụ tương ứng!' };
        }

        // TODO: Gọi Department Service để check phòng ban có tồn tại hay không
        const payload = {
            payload: {
                event: SERVICE_DEPARTMENT_EVENT_GET_DEPARTMENT_BY_DEPARTMENT_ID,
                data: {
                    department_id,
                },
            },
        };
        let getDepartmentByIDResult = await PublishServiceEvent(payload, SERVICE_DEPARTMENT);

        if (getDepartmentByIDResult.statusText !== 'OK') {
            return { status: false, message: 'Có lỗi trong quá trình xác thực thông tin phòng ban!' };
        }

        getDepartmentByIDResult = getDepartmentByIDResult.data;

        if (!getDepartmentByIDResult.status) {
            return getDepartmentByIDResult;
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
// #endregion

// #region Chức năng của Giám đốc
const resetPassword = async function ({ user_id }) {
    try {
        let user = await _User.findOne({ user_id });

        if (!user) {
            return { status: false, message: 'Không tìm thấy thông tin nhân viên cần đặt lại mật khẩu!' };
        }

        if (!user.account.request_reset_password) {
            return { status: false, message: 'Tài khoản này hiện không có nhu cầu đặt lại mật khẩu!' };
        }

        const hashedPassword = await bcrypt.hash(user_id, 10);
        user.account.password = hashedPassword;
        user.account.request_reset_password = false;

        await user.save();

        return { status: true, message: 'Đặt lại mật khẩu cho tài khoản nhân viên thành công!' };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getAllUsers = async function () {
    try {
        const users = await _User.find();

        return { status: true, message: 'Lấy danh sách nhân viên thành công!', data: users };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getUserDetail = async function ({ user_id }) {
    try {
        let user = await _User.findOne({ user_id });

        if (!user) {
            return { status: false, message: 'Không tìm thấy thông tin nhân viên!' };
        }

        return { status: true, message: 'Xem chi tiết thông tin nhân viên thành công!', data: user };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};
// #endregion

// #region Service Public Cho các Service Khác
const updateUserRole = async function ({ user_id, role_name }) {
    const session = await startSession();
    try {
        if (role_name === ROLE_NAME_DIRECTOR) {
            return { status: false, message: 'Không thể cập nhật chức vụ Giám đốc cho nhân viên!' };
        }

        session.startTransaction();

        const role = await _Role.findOne({ name: role_name }).session(session);

        if (!role) {
            await session.abortTransaction();
            return { status: false, message: 'Chức vụ không hợp lệ!' };
        }

        const user = await _User.findOneAndUpdate(
            {
                user_id,
            },
            {
                role_id: role._id,
            },
            {
                new: true,
                session,
            },
        );

        if (!user) {
            return { status: false, message: 'Không thể cập nhật chức vụ của nhân viên! Vui lòng thử lại sau!' };
        }

        // TODO: Gọi Absence Service cập nhật số ngày nghỉ phép tối đa
        await session.commitTransaction();
        return { status: true, message: 'Cập nhật chức vụ nhân viên thành công!', data: user };
    } catch (error) {
        console.error(error.message);
        await session.abortTransaction();
        return { status: false, message: error.message };
    } finally {
        await session.endSession();
    }
};

// #endregion
module.exports = {
    validateAddUser,
    addUser,

    resetPassword,

    getAllUsers,
    getUserDetail,

    updateUserRole,
};
