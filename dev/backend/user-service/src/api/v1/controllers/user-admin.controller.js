const {
    validateAddUser,
    addUser,
    resetPassword,
    getAllUsers,
    updateUserSalary,
} = require('../services/user-admin.service');

const { getUserInformation } = require('../services/user.service');

const AddUserController = async function (req, res, next) {
    try {
        const validationResult = await validateAddUser(req);

        if (!validationResult.status) {
            return res.status(403).json(validationResult);
        }

        const { status, message, data } = await addUser(req.body);

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const ResetPasswordController = async function (req, res, next) {
    try {
        const { status, message, data } = await resetPassword(req.body);

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const GetAllUsersController = async (req, res, next) => {
    try {
        const { status, message, data } = await getAllUsers();

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const GetUserDetailController = async (req, res, next) => {
    try {
        // Admin sử dụng JWT Admin và Query Params để đọc thông tin nhân viên
        const { status, message, data } = await getUserInformation(req.query);

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const UpdateUserSalaryController = async (req, res, next) => {
    try {
        // Admin sử dụng JWT Admin và Query Params để đọc thông tin nhân viên
        const { status, message, data } = await updateUserSalary(req.body);

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {
    AddUserController,
    ResetPasswordController,

    GetAllUsersController,
    GetUserDetailController,
    UpdateUserSalaryController,
};
