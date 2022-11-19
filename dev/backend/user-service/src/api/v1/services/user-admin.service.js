const bcrypt = require('bcrypt');
const { startSession } = require('mongoose');
const { validationResult } = require('express-validator');

const {
    ID_DIGITS,
    ROLE_NAME_DIRECTOR,
    ROLE_NAME_EMPLOYEE,

    SERVICE_DEPARTMENT,
    SERVICE_DEPARTMENT_EVENT_GET_DEPARTMENT_BY_DEPARTMENT_ID,

    SERVICE_ABSENCE,
    SERVICE_ABSENCE_EVENTS_CREATE_ABSENCE_INFORMATION,
    SERVICE_ABSENCE_EVENTS_UPDATE_ABSENCE_INFORMATION,
} = require('../constants/global.constant');

const PublishServiceEvent = require('../utils/service-communicate.util');
const { createNewIDWithOutPrefix } = require('../utils/generate-prefix-id.util');

const { _User, _Role } = require('../models');

// #region Thêm nhân viên [DONE]
// Kiểm tra đầu vào
async function validateAddUser(req) {
    try {
        const validateResult = validationResult(req);

        if (!validateResult.isEmpty()) {
            return { status: false, message: validateResult.errors[0].msg };
        }

        // Kiểm tra số điện thoại và email có trùng không?
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

        return { status: true, message: 'Kiểm tra đầu vào thành công' };
    } catch (error) {
        console.error(error.message);
        return { status: false, message: 'Có lỗi xảy ra trong quá trình kiểm tra đầu vào!' };
    }
}

// Sinh mã tự động
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

        // Lấy mã phòng ban + 2 số cuối của năm hiện tại + mã tự tăng 5 chữ số
        return `${department_index}${twoLastDigitFromYear}${maxCurrentID}`;
    } catch (err) {
        console.error(err.message);
        return err.message;
    }
};

const addUser = async function ({
    full_name,
    phone_number,
    email,
    day_of_birth,
    gender,
    department_id = 'PB00000',
    salary,
}) {
    const session = await startSession();
    try {
        session.startTransaction();
        // Tìm chức vụ nhân viên để lấy _id của role Nhân viên
        // Mặc định tất cả tài khoản được tạo đều có role là Nhân viên
        const role = await _Role.findOne({ name: ROLE_NAME_EMPLOYEE }).session(session).lean();

        if (!role) {
            return { status: false, message: 'Không tìm thấy chức vụ tương ứng!' };
        }

        // TODO [DONE]: Gọi Department Service để check phòng ban có tồn tại hay không
        let payload = {
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

        // Xác thực phòng ban thành công => Thêm nhân viên
        const user_id = await generateUniqueUserID(department_id);

        const hashedPassword = await bcrypt.hash(user_id, 10);

        const user = await _User.create(
            [
                {
                    user_id,
                    full_name,
                    phone_number,
                    email,
                    day_of_birth,
                    department_id,
                    role_id: role._id,
                    salary,
                    gender,
                    account: {
                        username: user_id,
                        password: hashedPassword,
                    },
                },
            ],
            { session },
        );

        if (user.length === 0) {
            await session.abortTransaction();
            return { status: false, message: 'Có lỗi trong quá trình tạo nhân viên!' };
        }

        // TODO: Gọi Absence Service để thêm thông tin nghỉ phép
        payload = {
            payload: {
                event: SERVICE_ABSENCE_EVENTS_CREATE_ABSENCE_INFORMATION,
                data: {
                    user_id,
                    role_name: role.name,
                },
            },
        };

        let createAbsenceInformationResult = await PublishServiceEvent(payload, SERVICE_ABSENCE);

        if (createAbsenceInformationResult.statusText !== 'OK') {
            await session.abortTransaction();
            return { status: false, message: 'Có lỗi trong quá trình tạo thông tin nghỉ phép!' };
        }

        createAbsenceInformationResult = createAbsenceInformationResult.data;

        if (!createAbsenceInformationResult.status) {
            await session.abortTransaction();
            return createAbsenceInformationResult;
        }

        await session.commitTransaction();

        return {
            status: true,
            message: 'Thêm nhân viên thành công! Tên tài khoản và mật khẩu mặc định là (Mã số nhân viên)!',
            data: user,
        };
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return { status: false, message: error.message };
    } finally {
        await session.endSession();
    }
};
// #endregion

// #region Chức năng của Giám đốc [DONE]
const resetPassword = async function ({ user_id }) {
    try {
        let user = await _User.findOne({ user_id });

        if (!user) {
            return { status: false, message: 'Không tìm thấy thông tin nhân viên cần đặt lại mật khẩu!' };
        }

        if (!user.account.request_reset_password) {
            return { status: false, message: 'Tài khoản này hiện không có nhu cầu đặt lại mật khẩu!' };
        }

        // Đặt lại mật khẩu = mã nhân viên và
        // cập nhật isActivate về false để sau khi được reset nhân viên phải đổi lại mật khẩu mặc định
        const hashedPassword = await bcrypt.hash(user_id, 10);
        user.account.password = hashedPassword;
        user.account.request_reset_password = false;
        user.account.is_activate = false;

        await user.save();

        return { status: true, message: 'Đặt lại mật khẩu cho tài khoản nhân viên thành công!' };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getAllUsers = async function () {
    try {
        const users = await _User
            .find()
            .populate({
                path: 'role_id',
                select: '-_id',
            })
            .select('-_id -account.password -account._id');

        return { status: true, message: 'Lấy danh sách nhân viên thành công!', data: users };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};
// #endregion

// #region Service Public Cho các Service Khác [WAIT-FOR-TESTING]
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

        const user = await _User.findOne({ user_id }).session(session);

        if (!user) {
            await session.abortTransaction();
            return {
                status: false,
                message: `Không thể cập nhật chức vụ của nhân viên do không tìm thấy nhân viên với mã ${user_id}!`,
            };
        }

        user.role_id = role._id;
        await user.save();

        // TODO: Gọi Absence Service cập nhật số ngày nghỉ phép tối đa
        const payload = {
            payload: {
                event: SERVICE_ABSENCE_EVENTS_UPDATE_ABSENCE_INFORMATION,
                data: {
                    user_id,
                    role_name: role.name,
                },
            },
        };

        let updateAbsenceInformationResult = await PublishServiceEvent(payload, SERVICE_ABSENCE);

        if (updateAbsenceInformationResult.statusText !== 'OK') {
            await session.abortTransaction();
            return { status: false, message: 'Có lỗi trong quá trình cập nhật thông tin nghỉ phép!' };
        }

        updateAbsenceInformationResult = updateAbsenceInformationResult.data;

        if (!updateAbsenceInformationResult.status) {
            await session.abortTransaction();
            return updateAbsenceInformationResult;
        }

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

const getAllUserIDByRoleName = async function ({ role_name }) {
    try {
        const role = await _Role.findOne({ name: role_name }).lean();

        if (!role) {
            return { status: false, message: 'Không tìm thấy chức vụ tương ứng!' };
        }

        const users = await _User.find({ role_id: role._id }).select('user_id -_id').lean();

        return { status: true, message: 'Lấy danh sách nhân viên theo chức vụ thành công!', data: users };
    } catch (error) {
        console.error(error.message);
        return { status: false, message: error.message };
    }
};

const getAllUserIDByDepartment = async function ({ department_id }) {
    try {
        const users = await _User.find({ department_id }).select('user_id').lean();

        return { status: true, message: 'Lấy danh sách nhân viên theo mã phòng ban thành công!', data: users };
    } catch (error) {
        console.error(error.message);
        return { status: false, message: error.message };
    }
};
// #endregion

// #region Update User Salary [DONE]
const updateUserSalary = async function ({ user_id, salary }) {
    try {
        if (isNaN(salary)) {
            return { status: false, message: 'Lương nhân viên có định dạng không phải là số!' };
        }

        if (salary < 0) {
            return { status: false, message: 'Lương nhân viên phải lớn hơn 0!' };
        }

        const user = await _User.findOne({ user_id });

        if (!user) {
            return { status: false, message: `Không tìm thấy nhân viên với mã nhân viên ${user_id}!` };
        }

        user.salary = salary;
        await user.save();

        return {
            status: true,
            message: 'Cập nhật lương nhân viên thành công!',
            data: {
                new_salary: salary,
            },
        };
    } catch (error) {
        console.error(error.message);
        return { status: false, message: error.message };
    }
};
// #endregion

module.exports = {
    validateAddUser,
    addUser,

    resetPassword,

    getAllUsers,

    updateUserRole,
    updateUserSalary,

    getAllUserIDByRoleName,
    getAllUserIDByDepartment,
};
