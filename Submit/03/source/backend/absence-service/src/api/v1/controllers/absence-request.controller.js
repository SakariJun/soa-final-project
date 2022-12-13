const {
    createAbsenceRequest,
    getAllAbsenceByManager,
    getAllAbsenceRequestByEmployee,
    getAbsenceRequestDetail,
    updateAbsenceRequestState,
    getAllUserAbsenceToday,
} = require('../services/absence-request.service');

const GetAllUserAbsenceTodayController = async (req, res, next) => {
    try {
        const { status, message, data } = await getAllUserAbsenceToday();

        if (!status) {
            return res.status(202).json({ status, message, data });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

// Tạo đơn xin nghỉ phép
const CreateAbsenceRequestController = async (req, res, next) => {
    try {
        const { status, message, data } = await createAbsenceRequest(req.payload, req.body, req.files);

        if (!status) {
            return res.status(202).json({ status, message, data });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

// Chức năng dành cho giám đốc, trưởng phòng để lấy danh sách các yêu cầu nghỉ phép chờ duyệt
const GetAllAbsenceByManagerRequestController = async (req, res, next) => {
    try {
        const { status, message, data } = await getAllAbsenceByManager(req.payload);

        if (!status) {
            return res.status(202).json({ status, message, data });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

// Chức năng dành cho người lao động (nhân viên, trưởng phòng)
const GetAllAbsenceRequestByEmployeeController = async (req, res, next) => {
    try {
        const { status, message, data } = await getAllAbsenceRequestByEmployee(req.payload);

        if (!status) {
            return res.status(202).json({ status, message, data });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

// Chức năng dành cho (Giám đốc, trưởng phòng) để xem chi tiết phiếu xin nghỉ phép
const GetAbsenceRequestDetailController = async (req, res, next) => {
    try {
        const { status, message, data } = await getAbsenceRequestDetail(req.query);

        if (!status) {
            return res.status(202).json({ status, message, data });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

// Chức năng dành cho (Giám đốc, trưởng phòng)
const UpdateAbsenceRequestStateController = async (req, res, next) => {
    try {
        const { status, message, data } = await updateAbsenceRequestState(req.payload, req.body);

        if (!status) {
            return res.status(202).json({ status, message, data });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {
    CreateAbsenceRequestController,
    GetAllAbsenceByManagerRequestController,
    GetAllAbsenceRequestByEmployeeController,
    GetAbsenceRequestDetailController,
    UpdateAbsenceRequestStateController,
    GetAllUserAbsenceTodayController,
};
