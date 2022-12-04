const { _Absence, _AbsenceRequest } = require('../models');
const DateDiff = require('../utils/day-diff.utils');

const {
    ROLE_NAME_LEADER,
    ROLE_NAME_EMPLOYEE,
    ROLE_NAME_DIRECTOR,

    MAX_ABSENCE_DAY_LEADER,
    MAX_ABSENCE_DAY_EMPLOYEE,
    ABSENCE_REQUEST_STATE_WAITING,
    ABSENCE_REQUEST_STATE_APPROVED,
    ABSENCE_REQUEST_STATE_REFUSED,

    SERVICE_USER,
    SERVICE_USER_EVENTS_GET_USERS_ID_BY_ROLE_NAME,
    SERVICE_USER_EVENTS_GET_USERS_ID_BY_DEPARTMENT_ID,
} = require('../constants/global.constant');
const firebase = require('../../../configs/firebase.config');
const PublishServiceEvent = require('../utils/service-communicate.util');

const createAbsenceRequest = async function ({ user_id, role_name }, { date_begin, absence_days, reason }, files) {
    try {
        if (role_name === ROLE_NAME_DIRECTOR) {
            return { status: false, message: 'Giám đốc không thể sử dụng tính năng này!' };
        }

        const absence = await _Absence.findOne({ user_id });

        if (!absence) {
            return {
                status: false,
                message: `Không thể tạo yêu cầu nghỉ phép do không tìm thấy thông tin nghỉ phép của nhân viên ${user_id}!`,
            };
        }

        if (absence.last_absence_request !== null) {
            const dayLeft = DateDiff.inDays(new Date(), absence.last_absence_request);

            if (dayLeft <= 7) {
                return {
                    status: false,
                    message: `Bạn đã gửi yêu cầu xin nghỉ vào lúc ${absence.last_absence_request}! Vui lòng đợi ${7 - dayLeft
                        } ngày nữa để gửi yêu cầu tiếp theo`,
                };
            }
        }

        if (isNan(absence_days) || parseFloat(absence_days) % 0.5 != 0) {
            return {
                status: false,
                message: "Số ngày muốn nghỉ phải chia hết cho 0.5 ngày!",
            }
        }

        const absenceDayLeft = absence.max_absence_day - absence.day_absence;

        if (absence_days > absenceDayLeft) {
            return {
                status: false,
                message: `Số ngày nghỉ còn lại trong năm của bạn chỉ là ${absenceDayLeft} ngày! Không thể xin nghỉ ${absence_days} ngày!`,
            };
        }

        const absenceRequest = await _AbsenceRequest.create({ user_id, date_begin, absence_days, reason });
        const path = `${user_id}/absence/${absenceRequest._id}`;

        for (let i = 0; i < files.length; i++) {
            await uploadFile(path, files[i]);
        }

        // Update last Absence Request to now
        absence.last_absence_request = new Date();
        absence.day_absence = absence.day_absence + absence_days;
        await absence.save();

        return { status: true, message: 'Tạo đơn xin nghỉ phép thành công!', data: 'OKE' };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

//Handle waiting to upload each file using promise
async function uploadFile(path, file) {
    try {
        const bucketFile = await firebase.bucket.file(`${path}/${file.originalname}`);

        const options = {
            resumable: false,
            metadata: { contentType: file.mimetype },
            predefinedAcl: 'publicRead',
            public: true,
        };

        await bucketFile.save(file.buffer, options);

        return { status: true, message: 'Upload file thành công!' };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

const getAllAbsenceByManager = async function ({ user_id, role_name, department_id }) {
    try {
        if (role_name === ROLE_NAME_DIRECTOR) {
            // Lấy danh sách user ID với role trưởng phòng => lấy được danh sách trưởng phòng
            const payload = {
                payload: {
                    event: SERVICE_USER_EVENTS_GET_USERS_ID_BY_ROLE_NAME,
                    data: {
                        role_name: ROLE_NAME_LEADER,
                    },
                },
            };

            let getAllLeaderID = await PublishServiceEvent(payload, SERVICE_USER);

            if (getAllLeaderID.statusText !== 'OK') {
                return { status: false, message: 'Có lỗi trong quá trình lấy thông tin danh sách trưởng phòng!' };
            }

            getAllLeaderID = getAllLeaderID.data;

            if (!getAllLeaderID.status) {
                return getAllLeaderID;
            }

            const user_id = getAllLeaderID.data.map((element) => {
                return element.user_id;
            });

            const absenceRequests = await _AbsenceRequest
                .find({ user_id: { $in: user_id }, status: ABSENCE_REQUEST_STATE_WAITING })
                .lean();

            return {
                status: true,
                message: 'Lấy danh sách đơn nghỉ phép của trưởng phòng thành công!',
                data: absenceRequests,
            };
        }

        if (role_name === ROLE_NAME_LEADER) {
            // Lấy danh sách user ID với role trưởng phòng => lấy được danh sách trưởng phòng
            const payload = {
                payload: {
                    event: SERVICE_USER_EVENTS_GET_USERS_ID_BY_DEPARTMENT_ID,
                    data: {
                        department_id: department_id,
                    },
                },
            };

            let getAllEmployeeID = await PublishServiceEvent(payload, SERVICE_USER);

            if (getAllEmployeeID.statusText !== 'OK') {
                return { status: false, message: 'Có lỗi trong quá trình lấy thông tin danh sách nhân viên!' };
            }

            getAllEmployeeID = getAllEmployeeID.data;

            if (!getAllEmployeeID.status) {
                return getAllEmployeeID;
            }

            const user_id_array = getAllEmployeeID.data.map((element) => {
                if (element.user_id !== user_id) {
                    return element.user_id;
                }
            });

            const absenceRequests = await _AbsenceRequest
                .find({ user_id: { $in: user_id_array }, status: ABSENCE_REQUEST_STATE_WAITING })
                .lean();

            return {
                status: true,
                message: 'Lấy danh sách đơn nghỉ phép của nhân viên thành công!',
                data: absenceRequests,
            };
        }

        return { status: false, message: 'Không tìm thấy chức vụ tương ứng để đọc danh sách nghỉ phép!' };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getAllAbsenceRequestByEmployee = async function ({ user_id, role_name, department_id }) {
    try {
        if (role_name === ROLE_NAME_DIRECTOR) {
            return { status: true, message: 'Giám đốc không có đơn xin nghỉ phép!' };
        }

        const absenceRequests = await _AbsenceRequest.find({ user_id }).lean();

        return { status: true, message: 'Lấy danh sách đơn xin nghỉ phép thành công!', data: absenceRequests };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getAbsenceRequestDetail = async function ({ absence_request_id }) {
    try {
        const absenceRequestDetail = await _AbsenceRequest.findById(absence_request_id).lean();

        if (!absenceRequestDetail) {
            return { status: false, message: 'Không tìm thấy thông tin chi tiết xin nghỉ phép!' };
        }

        let listFiles = await firebase.bucket.getFiles({
            prefix: `${absenceRequestDetail.user_id}/absence/${absenceRequestDetail._id}`,
        });

        listFiles = listFiles[0].map((element) => {
            const data = {
                url: element.metadata.mediaLink,
                name: element.metadata.name.split('/').pop(),
                size: element.metadata.size,
                type: element.metadata.contentType,
            };

            return data;
        });

        // TODO: Load danh sách file đính kèm
        absenceRequestDetail.files = listFiles;

        return { status: true, message: 'Xem chi tiết đơn xin nghỉ phép thành công!', data: absenceRequestDetail };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const updateAbsenceRequestState = async function (
    { user_id, role_name },
    { absence_request_id, response_message, state = ABSENCE_REQUEST_STATE_WAITING },
) {
    try {
        const validState = [
            ABSENCE_REQUEST_STATE_WAITING,
            ABSENCE_REQUEST_STATE_APPROVED,
            ABSENCE_REQUEST_STATE_REFUSED,
        ];

        if (!validState.includes(state)) {
            return { status: false, message: 'Trạng thái của đơn xin nghỉ phép không hợp lệ!' };
        }

        // TODO: Validate thêm user_id hiện tại có quyền duyệt mã đơn nghỉ phép này hay không!
        const absenceRequestDetail = await _AbsenceRequest.findById(absence_request_id);

        if (!absenceRequestDetail) {
            return { status: false, message: 'Không tìm thấy thông tin chi tiết xin nghỉ phép!' };
        }

        if (absenceRequestDetail.state !== ABSENCE_REQUEST_STATE_WAITING) {
            return { status: false, message: 'Chỉ có thể chỉ cập nhật đơn xin nghỉ đang ở trạng thái WAITING!' };
        }

        absenceRequestDetail.state = state;
        absenceRequestDetail.response_message = response_message;
        absenceRequestDetail.response_time = new Date();
        await absenceRequestDetail.save();

        return {
            status: true,
            message: 'Cập nhật trạng thái đơn xin nghỉ phép thành công!',
            data: absenceRequestDetail,
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getAllUserAbsenceToday = async function () {
    try {
        const absenceRequestDetail = await _AbsenceRequest.count({
            date_begin: {
                $lt: new Date(),
            },
            date_end: {
                $gt: new Date(),
            },
            state: ABSENCE_REQUEST_STATE_APPROVED,
        });

        return { status: true, message: 'Lấy tổng số nhân viên nghỉ hôm nay thành công!', data: absenceRequestDetail };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};
module.exports = {
    createAbsenceRequest,

    getAllAbsenceByManager,
    getAllAbsenceRequestByEmployee,
    getAbsenceRequestDetail,
    updateAbsenceRequestState,
    getAllUserAbsenceToday,
};
