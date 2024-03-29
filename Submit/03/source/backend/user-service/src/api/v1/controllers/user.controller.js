const {
    validateWithoutCustom,
    login,
    changePasswordRequire,
    changePasswordOptional,
    requestResetPassword,
    getUserInformation,
    changeUserAvatar,

    countAllUsers,
    countAllUsersByDepartmentID,
    getAllUserByLeader,
} = require('../services/user.service');

const GetAllUserByLeaderController = async function (req, res, next) {
    try {
        const { status, message, data } = await getAllUserByLeader(req.payload);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const CountAllUsersController = async function (req, res, next) {
    try {
        const { status, message, data } = await countAllUsers();

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const CountAllUsersByDepartmentIDController = async function (req, res, next) {
    try {
        const { status, message, data } = await countAllUsersByDepartmentID(req.query);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const LoginController = async function (req, res, next) {
    try {
        const validationResult = validateWithoutCustom(req);

        if (!validationResult.status) {
            return res.status(403).json(validationResult);
        }

        const { status, message, data } = await login(req.body);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        res.set('Access-Control-Allow-Origin', req.headers.origin); //req.headers.origin
        res.set('Access-Control-Allow-Credentials', 'true');
        // access-control-expose-headers allows JS in the browser to see headers other than the default 7
        res.set(
            'Access-Control-Expose-Headers',
            'date, etag, access-control-allow-origin, access-control-allow-credentials',
        );

        res.cookie('accessToken', data.accessToken, {
            secure: false,
            httpOnly: true,
            maxAge: 3600 * 24 * 60 * 60,
            path: '/',
        });

        return res.status(200).json({ status, message });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const ChangePasswordRequireController = async function (req, res, next) {
    try {
        const validationResult = validateWithoutCustom(req);

        if (!validationResult.status) {
            return res.status(403).json(validationResult);
        }

        const { status, message, data } = await changePasswordRequire(req.payload, req.body);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        res.set('Access-Control-Allow-Origin', req.headers.origin); //req.headers.origin
        res.set('Access-Control-Allow-Credentials', 'true');
        // access-control-expose-headers allows JS in the browser to see headers other than the default 7
        res.set(
            'Access-Control-Expose-Headers',
            'date, etag, access-control-allow-origin, access-control-allow-credentials',
        );

        res.cookie('accessToken', data.accessToken, {
            secure: false,
            httpOnly: true,
            maxAge: 3600 * 24 * 60 * 60,
            path: '/',
        });

        return res.status(200).json({ status, message });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const ChangePasswordOptionalController = async function (req, res, next) {
    try {
        const validationResult = validateWithoutCustom(req);

        if (!validationResult.status) {
            return res.status(403).json(validationResult);
        }

        const { status, message, data } = await changePasswordOptional(req.payload, req.body);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(200).json({ status, message });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const RequestResetPasswordController = async function (req, res, next) {
    try {
        const validationResult = validateWithoutCustom(req);
        console.error(
            '🚀 ~ file: user.controller.js ~ line 105 ~ RequestResetPasswordController ~ validationResult',
            validationResult,
        );
        console.error(validationResult);

        if (!validationResult.status) {
            return res.status(403).json(validationResult);
        }

        const { status, message, data } = await requestResetPassword(req.body);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(200).json({ status, message });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const GetUserInformationController = async function (req, res, next) {
    try {
        const { status, message, data } = await getUserInformation(req.payload);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const ChangeUserAvatarController = async function (req, res, next) {
    try {
        const { status, message, data } = await changeUserAvatar(req.file, req.payload);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(200).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {
    LoginController,
    ChangePasswordOptionalController,
    ChangePasswordRequireController,
    RequestResetPasswordController,

    GetUserInformationController,
    ChangeUserAvatarController,

    CountAllUsersController,
    CountAllUsersByDepartmentIDController,

    GetAllUserByLeaderController,
};
