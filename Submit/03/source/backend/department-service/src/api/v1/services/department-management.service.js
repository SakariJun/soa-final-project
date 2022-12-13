const { startSession } = require('mongoose');
const { validationResult } = require('express-validator');

const { _Department } = require('../models');

const {
    ID_DIGITS,
    SERVICE_USER,
    ROLE_NAME_LEADER,
    SERVICE_USER_EVENTS_SET_ROLE_BY_USER_ID,
    ROLE_NAME_EMPLOYEE,
} = require('../constants/global.constant');

const PublishServiceEvent = require('../utils/service-communicate.util');

const { createNewIDWithOutPrefix } = require('../utils/generate-prefix-id.util');

// Thêm phòng ban mới
const createDepartment = async function ({ name, room, description }) {
    try {
        let maxCurrentID = await _Department.find().sort('-department_id').limit(1).lean();

        // Nếu chưa có phòng ban nào thì mã phòng ban là PB00000
        if (maxCurrentID.length === 0) {
            // ID_DIGITS + 2 là để sinh ra mã PB00000 vì không + 2 sẽ ra PB000
            maxCurrentID = 'PB'.padEnd(ID_DIGITS + 2, '0');
        } else {
            // Nếu đã có phòng ban rồi thì lấy PB + Mã cao nhất hiện tại
            // VD: PB00004
            maxCurrentID = maxCurrentID[0].department_id;
            maxCurrentID = 'PB' + maxCurrentID.substring(maxCurrentID.length - ID_DIGITS, maxCurrentID.length);
        }

        maxCurrentID = createNewIDWithOutPrefix(maxCurrentID);

        const department = await _Department.create({
            department_id: maxCurrentID,
            name,
            room,
            description,
        });

        if (!department) {
            return { status: false, message: 'Tạo phòng ban không thành công!' };
        }

        return { status: true, message: 'Tạo phòng ban thành công!', data: department };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getAllDepartments = async function () {
    try {
        const departments = await _Department.find().select('-_id -__v').lean();

        return { status: true, message: 'Lấy danh sách phòng ban thành công!', data: departments };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getDepartmentDetail = async function ({ department_id }) {
    try {
        const department = await _Department.findOne({ department_id }).select('-_id -__v').lean();

        if (!department) {
            return { status: false, message: `Không tìm thấy phòng ban với mã ${department_id}!` };
        }

        return { status: true, message: 'Xem thông tin chi tiết phòng ban thành công!', data: department };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const updateDepartment = async function ({ department_id = '', name, room, description }) {
    try {
        const department = await _Department.findOne({ department_id });

        if (!department) {
            return { status: false, message: `Không tìm thấy phòng ban với mã ${department_id}!` };
        }

        department.name = name;
        department.room = room;
        department.description = description;

        await department.save();

        return { status: true, message: 'Cập nhật thông tin phòng ban thành công!', data: department };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const deleteDepartment = async function ({ department_id = '' }) {
    try {
        const deletedDepartment = await _Department.deleteOne({ department_id }).lean();

        // TODO: Gọi service User để set role của trưởng phòng về nhân viên
        // và cập nhật lại phognf ban cho tất cả nhân viên

        if (!deletedDepartment || deletedDepartment.deletedCount === 0) {
            return {
                status: false,
                message: `Xóa phòng ban không thành công! Không tìm thấy phòng ban với mã ${department_id}`,
            };
        }

        return { status: true, message: 'Xóa phòng ban thành công!', data: deletedDepartment };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const checkIsUserBelongToDepartment = function (user_id, department_id) {
    // Lấy ra mã phòng ban ở vị trí đầu của mã nhân viên

    try {
        const userDepartmentIndex = parseInt(user_id.substring(0, user_id.length - (ID_DIGITS + 2)));
        console.log(
            '🚀 ~ file: department-management.service.js ~ line 127 ~ checkIsUserBelongToDepartment ~ userDepartmentIndex',
            userDepartmentIndex,
        );
        const departmentIndex = parseInt(
            department_id.substring(department_id.length - ID_DIGITS, department_id.length),
        );
        console.log(
            '🚀 ~ file: department-management.service.js ~ line 131 ~ checkIsUserBelongToDepartment ~ departmentIndex',
            departmentIndex,
        );

        return userDepartmentIndex === departmentIndex;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const assignLeaderDepartment = async function ({ leader_id, department_id }, isChange = false) {
    const session = await startSession();
    try {
        session.startTransaction();

        // Kiểm tra xem nhân viên có thuộc phòng ban hay không
        if (!checkIsUserBelongToDepartment(leader_id, department_id)) {
            return { status: false, message: `Nhân viên ${leader_id} không thuộc phòng ban ${department_id}!` };
        }

        // Kiểm tra phòng ban có tồn tại hay chưa?
        const department = await _Department.findOne({ department_id }).session(session);

        if (!department) {
            await session.abortTransaction();
            return { status: false, message: `Không tìm thấy phòng ban với mã ${department_id}!` };
        }

        if (!isChange) {
            // Kiểm tra phòng ban đã có trưởng phòng hay chưa?
            if (department.leader_id !== null) {
                await session.abortTransaction();
                return {
                    status: false,
                    message: `Phòng ban ${department_id} đã có trưởng phòng là nhân viên ${department.leader_id}!`,
                };
            }
        }

        // Kiểm tra mã nhân viên vừa nhận có phải là trưởng phòng của phòng ban nào chưa?
        const checkIsAlreadyLeader = await _Department.findOne({ leader_id }).session(session);

        if (checkIsAlreadyLeader) {
            return {
                status: false,
                message: `Nhân viên ${leader_id} đã là trưởng phòng của phòng ban ${checkIsAlreadyLeader.department_id}`,
            };
        }

        // Nếu nhân viên hiện tại chưa làm trưởng phòng của phòng ban nào
        // Và phòng ban chưa có trưởng phòng
        // thì cập nhật trưởng phòng của phòng ban
        department.leader_id = leader_id;
        await department.save();

        // Sau khi tạo phòng ban xong thì gọi sang User Service để cập nhật role của nhân viên
        const payload = {
            payload: {
                event: SERVICE_USER_EVENTS_SET_ROLE_BY_USER_ID,
                data: {
                    user_id: leader_id,
                    role_name: ROLE_NAME_LEADER,
                },
            },
        };

        let userServiceResponse = await PublishServiceEvent(payload, SERVICE_USER);

        // Nếu cập nhật role của nhân viên thành trưởng phòng không thành công thì abortTransaction
        if (userServiceResponse.statusText !== 'OK') {
            await session.abortTransaction();
            return userServiceResponse;
        }

        await session.commitTransaction();
        return { status: true, message: 'Bổ nhiệm trưởng phòng thành công!' };
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return { status: false, message: error.message };
    } finally {
        await session.endSession();
    }
};

const changeLeaderDepartment = async function ({ leader_id, department_id }) {
    const session = await startSession();
    try {
        session.startTransaction();

        let department = await _Department.findOne({ department_id }).session(session);

        if (!department) {
            await session.abortTransaction();
            return {
                status: false,
                message: `Không tìm thấy phòng ban với mã ${department_id}`,
            };
        }

        // Lưu lại ID của trưởng phòng cũ

        if (department.leader_id === null) {
            await session.abortTransaction();
            return {
                status: false,
                message: `Phòng ban ${department_id} hiện chưa có trưởng phòng! Không thể thay thế!`,
            };
        }

        const oldLeaderID = department.leader_id;

        // Cập nhật trưởng phòng mới
        const assignNewLeaderResult = await assignLeaderDepartment({ leader_id, department_id }, true);

        if (!assignNewLeaderResult.status) {
            await session.abortTransaction();
            return assignNewLeaderResult;
        }

        // Nếu cập nhật trưởng phòng mới thành công không lỗi!
        // Thì cập nhật lại chức vụ của trưởng phòng cũ về nhân viên
        const payload = {
            payload: {
                event: SERVICE_USER_EVENTS_SET_ROLE_BY_USER_ID,
                data: {
                    user_id: oldLeaderID,
                    role_name: ROLE_NAME_EMPLOYEE,
                },
            },
        };

        let userServiceResponse = await PublishServiceEvent(payload, SERVICE_USER);

        if (userServiceResponse.statusText !== 'OK') {
            await session.abortTransaction();
            return userServiceResponse;
        }

        await session.commitTransaction();
        return { status: true, message: `Thay đổi trưởng phòng cho phòng ban ${department_id} thành công!` };
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return { status: false, message: error.message };
    } finally {
        await session.endSession();
    }
};

//#region Validate
function validateWithoutCustom(req) {
    const validateResult = validationResult(req);

    if (!validateResult.isEmpty()) {
        return { status: false, message: validateResult.errors[0].msg };
    }

    return { status: true };
}

//#endregion

module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentDetail,
    updateDepartment,
    deleteDepartment,

    assignLeaderDepartment,
    changeLeaderDepartment,

    validateWithoutCustom,
};
