const bcrypt = require('bcrypt');
const moment = require('moment');

const { _User, _Role } = require('../models');
const { signAccessToken } = require('../utils/json-web-token.util');

const addEmployee = async function ({ username, fullname, email, dob, phonenumber, department, gender }) {
    try {
        const hashedPassword = await bcrypt.hash(student_id, 10);

        const user = await _User.create({
            full_name,
            phone_number,
            email,
            student_id,
            account: {
                username: student_id,
                password: hashedPassword,
            },
        });

        return {
            status: true,
            message: 'Tạo tài khoản thành công! Tên tài khoản và mật khẩu mặc định là [mã số sinh viên]!',
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
            user_id: user._id,
            phone_number: user.phone_number,
            email: user.email,
            student_id: user.student_id,
        };

        const accessToken = await signAccessToken(payload);

        delete payload.user_id;
        payload.full_name = user.full_name;
        payload.balance = user.balance;

        return {
            status: true,
            message: 'Đăng nhập thành công!',
            data: {
                accessToken,
                user_data: payload,
            },
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const getUserInformation = async function ({ user_id }) {
    try {
        if (!user_id) {
            return {
                status: false,
                message: 'Không tìm thấy thông tin người dùng! Vui lòng đăng xuất và đăng nhập lại!',
            };
        }

        const user = await _User.findById(user_id).lean();

        if (!user) {
            return {
                status: false,
                message: 'Không tìm thấy thông tin người dùng! Vui lòng đăng xuất và đăng nhập lại!',
            };
        }
        console.log(user_id);
        const transaction = await _Transaction
            .find({
                $or: [
                    {
                        send_from: user._id,
                    },
                    {
                        send_to: user._id,
                    },
                ],
            })
            .populate({
                path: 'send_from',
                select: 'student_id full_name -_id',
            })
            .populate({
                path: 'send_to',
                select: 'student_id full_name -_id',
            })
            .lean();

        for (let i = 0; i < transaction.length; i++) {
            let createdAt = new Date(transaction[i].createdAt);
            createdAt = moment(createdAt).format('DD/MM/YYYY HH:mm:ss');

            transaction[i].createdAt = createdAt;
        }

        const data = {
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            balance: user.balance,
            student_id: user.student_id,
            transactions: transaction,
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
