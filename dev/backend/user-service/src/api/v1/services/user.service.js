const bcrypt = require('bcrypt');

const { ID_DIGITS } = require('../constants/global.constant');

const { _User, _Role } = require('../models');
const { signAccessToken } = require('../utils/json-web-token.util');

const addUser = async function ({ full_name, email, day_of_birth, phone_number, department_id = 'PB00000', gender }) {
    try {
        const checkDuplicateInformation = await _User
            .findOne({
                $or: [
                    {
                        email: email,
                    },
                    {
                        phone_number: phone_number,
                    },
                ],
            })
            .lean();

        if (!checkDuplicateInformation) {
            if (checkDuplicateInformation.email === email) {
                return res.status(400).json({ status: false, messsage: 'Địa chỉ email đã tồn tại!' });
            }

            if (checkDuplicateInformation.phone_number === phone_number) {
                return res.status(400).json({ status: false, messsage: 'Số điện thoại đã tồn tại!' });
            }
        }

        const department_index = parseInt(department_id.subString(len(department_id) - ID_DIGITS, len(department_id)));
        const twoLastDigitFromYear = new Date().getFullYear().toString().substr(-2);

        const unique_user_id = `${department_index}${twoLastDigitFromYear}`;

        const hashedPassword = await bcrypt.hash(student_id, 10);

        const user = await _User.create({
            full_name,
            phone_number,
            email,
            day_of_birth,
            department_id,
            gender,
            account: {
                username: student_id,
                password: hashedPassword,
            },
        });

        return {
            status: true,
            message: 'Thêm nhân viên thành công! Tên tài khoản và mật khẩu mặc định là [Mã số nhân viên]!',
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

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
            role: user.role_id,
            phone_number: user.phone_number,
            email: user.email,
        };

        const accessToken = await signAccessToken(payload);

        return {
            status: true,
            message: 'Đăng nhập thành công!',
            data: {
                accessToken,
            },
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getUserInformation = async function ({ _id }) {
    try {
        if (!_id) {
            return {
                status: false,
                message: 'Không tìm thấy thông tin người dùng! Vui lòng đăng xuất và đăng nhập lại!',
            };
        }

        const user = await _User.findById(_id).lean();

        if (!user) {
            return {
                status: false,
                message: 'Không tìm thấy thông tin người dùng! Vui lòng đăng xuất và đăng nhập lại!',
            };
        }

        // const transaction = await _Transaction
        //     .find({
        //         $or: [
        //             {
        //                 send_from: user._id,
        //             },
        //             {
        //                 send_to: user._id,
        //             },
        //         ],
        //     })
        //     .populate({
        //         path: 'send_from',
        //         select: 'student_id full_name -_id',
        //     })
        //     .populate({
        //         path: 'send_to',
        //         select: 'student_id full_name -_id',
        //     })
        //     .lean();

        // for (let i = 0; i < transaction.length; i++) {
        //     let createdAt = new Date(transaction[i].createdAt);
        //     createdAt = moment(createdAt).format('DD/MM/YYYY HH:mm:ss');

        //     transaction[i].createdAt = createdAt;
        // }

        const data = {
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
        };

        return {
            status: true,
            message: 'Lấy thông tin người dùng thành công !',
            data,
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const updateUserBalance = async function ({ user_id }, { balance }) {
    try {
        if (!user_id) {
            return {
                status: false,
                message: 'Không tìm thấy thông tin người dùng! Vui lòng đăng xuất và đăng nhập lại!',
            };
        }

        if (isNaN(balance)) {
            return {
                status: false,
                message: 'Số dư tài khoản phải có định dạng số!',
            };
        }

        balance = parseFloat(balance);

        const user = await _User.findOneAndUpdate(
            {
                _id: user_id,
            },
            {
                $inc: {
                    balance: balance,
                },
            },
            {
                new: true,
            },
        );

        if (!user) {
            return {
                status: false,
                message: 'Cập nhật số dư người dùng không thành công! Lỗi: Không tìm thấy thông tin người dùng!',
            };
        }

        return {
            status: true,
            message: 'Cập nhật số dư người dùng thành công!',
            data: {
                user_new_balance: user.balance,
            },
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    registerAccount,
    login,
    getUserInformation,
    updateUserBalance,
};
