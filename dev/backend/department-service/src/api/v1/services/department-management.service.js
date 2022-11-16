const { startSession } = require('mongoose');
const { validationResult } = require('express-validator');

const { _Department } = require('../models');

const {
    ID_DIGITS,
    SERVICE_USER,
    ROLE_NAME_LEADER,
    SERVICE_USER_EVENTS_SET_ROLE_BY_USER_ID,
} = require('../constants/global.constant');
const PublishServiceEvent = require('../utils/service-communicate.util');
const { createNewIDWithOutPrefix } = require('../utils/generate-prefix-id.util');

const createDepartment = async function ({ name, room, leader_id = '', description }) {
    const session = await startSession();
    try {
        session.startTransaction();

        if (leader_id !== '') {
            // TODO: Check xem hiện tại leader_id có đang làm trưởng phòng của phòng ban nào không
            // Nếu có thì báo lỗi
            const checkIsAlreadyLeader = await _Department.findOne({ leader_id }).lean();

            if (!checkIsAlreadyLeader) {
                await session.abortTransaction();
                return {
                    status: false,
                    message: `Nhân viên ${leader_id} đã là trưởng phòng của phòng ban ${checkIsAlreadyLeader.name}`,
                };
            }
        }

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
            leader_id,
            description,
        });

        if (!department) {
            await session.abortTransaction();
            return { status: false, message: 'Tạo phòng ban không thành công!' };
        }

        if (leader_id !== '') {
            // TODO: Tạo thành công department => Gọi qua User Service set Role cho nhân viên
            // Thành trưởng phòng (nếu có)
            const assignLeaderResult = await assignLeaderDepartment({
                department_id: department.department_id,
                leader_id,
            });

            if (!assignLeaderResult.status) {
                await session.abortTransaction();
                return assignLeaderResult;
            }
        }

        await session.commitTransaction();
        return { status: true, message: 'Tạo phòng ban thành công!', data: department };
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return { status: false, message: error.message };
    } finally {
        await session.endSession();
    }
};

const getAllDepartments = async function () {
    try {
        const departments = await _Department.find().lean();

        return { status: true, message: 'Lấy danh sách phòng ban thành công!', data: departments };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getDepartmentDetail = async function ({ department_id }) {
    try {
        const department = await _Department.findOne({ department_id }).lean();

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

const assignLeaderDepartment = async function ({ leader_id, department_id }) {
    const session = await startSession();
    try {
        session.startTransaction();
        // TODO: Gọi sang service khác để kiểm tra
        // leader_id hiện tại có tồn tại và đang làm trưởng phòng hay không

        const department = await _Department.findOneAndUpdate(
            {
                department_id,
            },
            {
                leader_id,
            },
            {
                new: true,
            },
        );

        if (!department) {
            await session.abortTransaction();
            return { status: false, message: 'Bổ nhiệm trưởng phòng không thành công!' };
        }

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

        if (!userServiceResponse.status) {
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

const removeLeaderDepartment = async function () {
    try {
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
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
    removeLeaderDepartment,

    validateWithoutCustom,
};