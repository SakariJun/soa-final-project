const {
    createDepartment,
    getAllDepartments,
    updateDepartment,
    deleteDepartment,
    assignLeaderDepartment,
    removeLeaderDepartment,
} = require('../services/department-management.service');

const CreateDepartmentController = async function (req, res, next) {
    try {
        const validationResult = await validateAddUser(req);

        if (!validationResult.status) {
            return res.status(403).json(validationResult);
        }

        const { status, message, data } = await createDepartment(req.body);

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const UpdateDepartmentController = async function (req, res, next) {
    try {
        const validationResult = await validateAddUser(req);

        if (!validationResult.status) {
            return res.status(403).json(validationResult);
        }

        const { status, message, data } = await updateDepartment(req.body);

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const DeleteDepartmentController = async (req, res, next) => {
    try {
        const { status, message, data } = await deleteDepartment(req.query);

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const GetAllDepartmentsController = async (req, res, next) => {
    try {
        const { status, message, data } = await getAllDepartments();

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const GetDepartmentDetailController = async (req, res, next) => {
    try {
        const { status, message, data } = await getAllDepartments(req.query);

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const AssignLeaderDepartmentController = async function (req, res, next) {
    try {
        const validationResult = await validateAddUser(req);

        if (!validationResult.status) {
            return res.status(403).json(validationResult);
        }

        const { status, message, data } = await assignLeaderDepartment(req.body);

        if (!status) {
            return res.status(202).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const RemoveLeaderDepartmentController = async function (req, res, next) {
    try {
        const validationResult = await validateAddUser(req);

        if (!validationResult.status) {
            return res.status(403).json(validationResult);
        }

        const { status, message, data } = await removeLeaderDepartment(req.body);

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
    CreateDepartmentController,
    GetAllDepartmentsController,
    GetDepartmentDetailController,
    UpdateDepartmentController,
    DeleteDepartmentController,

    AssignLeaderDepartmentController,
    RemoveLeaderDepartmentController,
};
