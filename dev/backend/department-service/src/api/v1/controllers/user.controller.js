const { registerAccount, login, getUserInformation, updateUserBalance } = require('../services/user.service');

const UserRegisterController = async function (req, res, next) {
    try {
        const { status, message, data } = await registerAccount(req.body);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

const UserLoginController = async function (req, res, next) {
    try {
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

        delete data.accessToken;

        return res.status(200).json({ status, message, data });
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

const UpdateUserBalanceController = async function (req, res, next) {
    try {
        const { status, message, data } = await updateUserBalance(req.payload, req.body);

        if (!status) {
            return res.status(200).json({ status, message });
        }

        return res.status(201).json({ status, message, data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: err.message });
    }
};

module.exports = {
    UserRegisterController,
    UserLoginController,
    GetUserInformationController,
    UpdateUserBalanceController,
};
