const { validateAddUser, addUser, validateLogin, login } = require('../services/user.service');

const AddUserController = async function (req, res, next) {
    try {
        const validationResult = await validateAddUser(req);
        console.log('🚀 ~ file: user.controller.js ~ line 6 ~ AddUserController ~ validationResult', validationResult);

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

const LoginController = async function (req, res, next) {
    try {
        const validationResult = validateLogin(req);

        if (!validationResult.status) {
            return res.status(403).json(validationResult);
        }

        const { status, message, data } = await login(req.body);
        console.log('🚀 ~ file: user.controller.js ~ line 34 ~ LoginController ~ data', data);

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

module.exports = {
    LoginController,
    GetUserInformationController,
};
