const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const { _User } = require('../models');
const { signAccessToken } = require('../utils/json-web-token.util');

//#region Log in
const login = async function ({ username, password }) {
    try {
        if (!username || !password) {
            return { status: false, message: 'Vui lòng điền tên tài khoản và mật khẩu!' };
        }

        const user = await _User.findOne({ 'account.username': username }).lean();

        if (!user) {
            return { status: false, message: 'Sai tên tài khoản hoặc mật khẩu!' };
        }

        if (!(await bcrypt.compare(password, user.account.password))) {
            // Do NOT show to client that password is wrong
            return { status: false, message: 'Sai tên tài khoản hoặc mật khẩu!' };
        }

        const payload = {
            _id: user._id,
            user_id: user.user_id,
            role_id: user.role_id,
            phone_number: user.phone_number,
            email: user.email,
            is_activate: user.account.is_activate,
        };

        const accessToken = await signAccessToken(payload);

        if (!user.account.is_activate) {
            return {
                status: true,
                message:
                    'Đăng nhập thành công! Vui lòng đổi mật khẩu trước khi có thể sử dụng các tính năng của hệ thống!',
                data: {
                    // Gửi kèm accessToken ở đây để controller set vào cookie
                    // Sau đó xóa đi (Không gửi jwt về client)
                    accessToken,
                },
            };
        }

        return {
            status: true,
            message: 'Đăng nhập thành công!',
            data: {
                // Gửi kèm accessToken ở đây để controller set vào cookie
                // Sau đó xóa đi (Không gửi jwt về client)
                accessToken,
            },
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

//#endregion

//#region Get User information
const getUserInformation = async function ({ user_id }) {
    try {
        if (!user_id) {
            return {
                status: false,
                message: 'Không tìm thấy thông tin người dùng! Vui lòng đăng xuất và đăng nhập lại!',
            };
        }

        const user = await _User
            .findOne({ user_id })
            .populate({
                path: 'role_id',
                select: '-_id',
            })
            .lean();

        if (!user) {
            return {
                status: false,
                message: 'Không tìm thấy thông tin người dùng! Vui lòng đăng xuất và đăng nhập lại!',
            };
        }

        delete user.account;
        console.log('🚀 ~ file: user.service.js ~ line 85 ~ getUserInformation ~ user', user);

        return {
            status: true,
            message: 'Lấy thông tin người dùng thành công !',
            data: user,
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};
//#endregion

//#region Change password
const changePasswordOptional = async function ({ _id }, { old_password, new_password, new_password_confirm }) {
    try {
        if (new_password !== new_password_confirm) {
            return { status: false, message: 'Mật khẩu mới không khớp!' };
        }

        if (new_password === old_password) {
            return { status: false, message: 'Mật khẩu mới không được trùng với mật khẩu cũ!' };
        }

        let user = await _User.findById(_id).lean();

        if (!user) {
            return { status: false, message: 'Không tìm thấy thông tin tài khoản!' };
        }

        if (!(await bcrypt.compare(old_password, user.account.password))) {
            // Do NOT show to client that password is wrong
            return { status: false, message: 'Mật khẩu cũ không chính xác!' };
        }

        const newPasswordHashes = await bcrypt.hash(new_password, 10);

        user = await _User.findOneAndUpdate(
            { _id: user._id },
            { 'account.password': newPasswordHashes },
            {
                new: true,
            },
        );

        if (!user) {
            return { status: false, message: 'Đổi mật khẩu không thành công! Vui lòng thử lại sau!' };
        }

        return {
            status: true,
            message: 'Đổi mật khẩu thành công!',
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const changePasswordRequire = async function ({ _id }, { new_password, new_password_confirm }) {
    try {
        if (new_password !== new_password_confirm) {
            return { status: false, message: 'Mật khẩu mới không khớp!' };
        }

        let user = await _User.findById(_id).lean();

        if (!user) {
            return { status: false, message: 'Không tìm thấy thông tin tài khoản!' };
        }

        if (new_password === user.user_id) {
            return { status: false, message: 'Mật khẩu mới không được trùng với mật khẩu cũ!' };
        }

        const newPasswordHashes = await bcrypt.hash(new_password, 10);

        user = await _User.findOneAndUpdate(
            { _id: user._id },
            { 'account.password': newPasswordHashes, 'account.is_activate': true },
            {
                new: true,
            },
        );

        if (!user) {
            return { status: false, message: 'Đổi mật khẩu không thành công! Vui lòng thử lại sau!' };
        }

        const payload = {
            _id: user._id,
            user_id: user.user_id,
            role_id: user.role_id,
            phone_number: user.phone_number,
            email: user.email,
            is_activate: user.account.is_activate,
        };

        const accessToken = await signAccessToken(payload);

        return {
            status: true,
            message: 'Đổi mật khẩu thành công!',
            data: { accessToken },
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const requestResetPassword = async function ({ email, phone_number }) {
    try {
        let user = await _User.findOne({ email, phone_number });

        if (!user) {
            return { status: false, message: 'Không tìm thấy thông tin tài khoản!' };
        }

        if (user.account.request_reset_password) {
            return { status: false, message: 'Bạn đã gửi yêu cầu đặt lại mật khẩu!' };
        }

        user.account.request_reset_password = true;
        await user.save();
        return {
            status: true,
            message: 'Gửi yêu cầu đặt lại mật khẩu thành công!',
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};
//#endregion

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
    validateWithoutCustom,

    login,
    changePasswordRequire,
    changePasswordOptional,
    requestResetPassword,

    getUserInformation,
};
