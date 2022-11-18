const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const { _User } = require('../models');
const firebase = require('../../../configs/firebase.config');

const {
    ROLE_NAME_DIRECTOR,
    SERVICE_ABSENCE,
    SERVICE_DEPARTMENT,

    SERVICE_ABSENCE_EVENTS_GET_ABSENCE_INFORMATION,
    SERVICE_DEPARTMENT_EVENT_GET_DEPARTMENT_BY_DEPARTMENT_ID,
} = require('../constants/global.constant');

const { signAccessToken } = require('../utils/json-web-token.util');
const PublishServiceEvent = require('../utils/service-communicate.util');

// #region Đổi ảnh đại diện
const changeUserAvatar = async function (file, { user_id }) {
    try {
        if (!file) {
            return { status: false, message: 'Không tìm thấy file ảnh đại diện!' };
        }

        if (file.size > 5242880) {
            return { status: false, message: 'Chỉ cho phép upload file ảnh với kích thước nhỏ hơn 5MB!' };
        }

        const supportedMIMEtype = ['image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

        if (!supportedMIMEtype.includes(file.mimetype)) {
            return { status: false, message: `Hệ thống không hỗ trợ định dạng ${file.mimetype}!` };
        }

        const user = await _User.findOne({ user_id });

        if (!user) {
            return { status: false, message: `Không tìm thấy thông tin nhân viên ${user_id}!` };
        }

        if (user.avatar !== null) {
            // Xử lý xóa ảnh cũ
            let oldAvatar = await firebase.bucket.getFiles(`${user.user_id}`);

            // Nếu lấy file trong thư mục mã nhân viên
            // Có tồn tại file thì lấy tên file đó xóa
            if (oldAvatar.length !== 0) {
                oldAvatar = await firebase.bucket.file(oldAvatar[0][0].name);
                await oldAvatar.delete();
            }
        }

        const fileExtension = file.originalname.split('.').pop();
        const bucketFile = await firebase.bucket.file(`${user_id}/avatar.${fileExtension}`);

        const options = {
            resumable: false,
            metadata: { contentType: file.mimetype },
            predefinedAcl: 'publicRead',
            public: true,
        };

        await bucketFile.save(file.buffer, options);

        const avatar_url = bucketFile.metadata.mediaLink;
        user.avatar = avatar_url;
        await user.save();

        return {
            status: true,
            message: 'Cập nhật ảnh đại diện thành công!',
            data: {
                avatar_url,
            },
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};
// #endregion

//#region Get User information By ID [DONE]
const getUserInformation = async function ({ user_id }) {
    try {
        if (!user_id) {
            return {
                status: false,
                message: 'Không tìm thấy thông tin người dùng! Vui lòng đăng xuất và đăng nhập lại!',
            };
        }

        const user = await _User
            .findOne({ user_id }, '-_id -account')
            .populate({
                path: 'role_id',
                select: '-_id',
            })
            .lean();
        console.log('🚀 ~ file: user.service.js ~ line 101 ~ getUserInformation ~ user', user);

        if (!user) {
            return {
                status: false,
                message: `Không tìm thấy thông tin nhân viên với mã ${user_id}!`,
            };
        }

        // Nếu role là giám đốc thì không có thông tin về phòng ban và thông tin nghỉ phép
        if (user.role_id.name !== ROLE_NAME_DIRECTOR) {
            // TODO: Gọi Absence Service lấy thông tin nghỉ phép trả về kèm ở API này
            // TODO: Gọi Department Service lấy thông tin phòng ban trả về kèm ở API này
            const payload_department = {
                payload: {
                    event: SERVICE_DEPARTMENT_EVENT_GET_DEPARTMENT_BY_DEPARTMENT_ID,
                    data: {
                        department_id: user.department_id,
                    },
                },
            };

            const payload_absence = {
                payload: {
                    event: SERVICE_ABSENCE_EVENTS_GET_ABSENCE_INFORMATION,
                    data: {
                        user_id,
                    },
                },
            };

            let extraInformationResult = await Promise.all([
                PublishServiceEvent(payload_department, SERVICE_DEPARTMENT),
                PublishServiceEvent(payload_absence, SERVICE_ABSENCE),
            ]);

            console.log(
                '🚀 ~ file: user.service.js ~ line 132 ~ getUserInformation ~ extraInformationResult',
                extraInformationResult,
            );

            if (extraInformationResult[0].statusText !== 'OK' && extraInformationResult[1].statusText !== 'OK') {
                return {
                    status: false,
                    message: 'Có lỗi trong quá trình lấy thông tin phòng ban và thông tin nghỉ phép!',
                };
            }

            departmentInfo = extraInformationResult[0].data;
            absenceInfo = extraInformationResult[1].data;

            if (!departmentInfo.status) {
                return departmentInfo;
            }

            if (!absenceInfo.status) {
                return absenceInfo;
            }

            user.department = departmentInfo.data;
            user.absence = absenceInfo.data;
        }

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

//#region Log-in [DONE]
const login = async function ({ username, password }) {
    try {
        const user = await _User.findOne({ 'account.username': username }).lean();

        if (!user) {
            return { status: false, message: 'Sai tên tài khoản hoặc mật khẩu!' };
        }

        if (!(await bcrypt.compare(password, user.account.password))) {
            // Do NOT show to client that password is wrong
            return { status: false, message: 'Sai tên tài khoản hoặc mật khẩu!' };
        }

        // Trong JWT gửi kèm
        // Mã nhân viên, mã quyền, có đổi mật khẩu mặc định hay chưa?
        const payload = {
            _id: user._id,
            user_id: user.user_id,
            role_id: user.role_id,
            phone_number: user.phone_number,
            email: user.email,
            is_activate: user.account.is_activate,
        };

        const accessToken = await signAccessToken(payload);

        let message = '';
        if (!user.account.is_activate) {
            message =
                'Đăng nhập thành công! Vui lòng đổi mật khẩu trước khi có thể sử dụng các tính năng của hệ thống!';
        } else {
            message = 'Đăng nhập thành công!';
        }

        return {
            status: true,
            message,
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

//#region Change password [DONE]
// Đổi mật khẩu (tùy chọn)
const changePasswordOptional = async function ({ user_id }, { old_password, new_password, new_password_confirm }) {
    try {
        if (new_password !== new_password_confirm) {
            return { status: false, message: 'Mật khẩu mới không khớp!' };
        }

        if (new_password === old_password) {
            return { status: false, message: 'Mật khẩu mới không được trùng với mật khẩu cũ!' };
        }

        let user = await _User.findOne({ user_id }).lean();

        if (!user) {
            return { status: false, message: 'Không tìm thấy thông tin tài khoản!' };
        }

        if (!(await bcrypt.compare(old_password, user.account.password))) {
            // Do NOT show to client that password is wrong
            return { status: false, message: 'Mật khẩu cũ không chính xác!' };
        }

        const newPasswordHashes = await bcrypt.hash(new_password, 10);

        user = await _User.findOneAndUpdate(
            { user_id: user.user_id },
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

// Đổi mật khẩu bắt buộc khi vừa được Giám đốc thêm tài khoản
const changePasswordRequire = async function ({ user_id }, { new_password, new_password_confirm }) {
    try {
        if (new_password !== new_password_confirm) {
            return { status: false, message: 'Mật khẩu mới không khớp!' };
        }

        let user = await _User.findOne({ user_id }).lean();

        if (!user) {
            return { status: false, message: 'Không tìm thấy thông tin tài khoản!' };
        }

        if (new_password === user.user_id) {
            return { status: false, message: 'Mật khẩu mới không được trùng với mật khẩu cũ!' };
        }

        const newPasswordHashes = await bcrypt.hash(new_password, 10);

        user = await _User.findOneAndUpdate(
            { user_id: user.user_id },
            { 'account.password': newPasswordHashes, 'account.is_activate': true },
            {
                new: true,
            },
        );

        if (!user) {
            return { status: false, message: 'Đổi mật khẩu không thành công! Vui lòng thử lại sau!' };
        }

        // Sau khi đổi mật khẩu bắt buộc thành công
        // Cập nhật lại is_activate trong DB cũng như trong JWT
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
            return { status: false, message: 'Bạn đã gửi yêu cầu đặt lại mật khẩu rồi! Vui lòng đợi Giám đốc duyệt' };
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
    changeUserAvatar,
};
