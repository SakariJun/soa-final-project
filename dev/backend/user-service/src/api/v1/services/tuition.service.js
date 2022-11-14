const { _User, _Tuition } = require('../models');
const { generateOTP } = require('./otp.service');
const { TUITION_STATE_UNPAID, TUITION_STATE_PAID } = require('../constants/tuition.constant');

const createTuition = async function ({ student_id, tuition_payment }) {
    try {
        if (!student_id || !tuition_payment) {
            return { status: false, message: 'Vui lòng điền đầy đủ thông tin để tạo học phí!' };
        }

        if (isNaN(tuition_payment) && typeof tuition_payment !== 'number') {
            return {
                status: false,
                message: 'Học phí không hợp lệ!',
            };
        }

        const user = await _User.findOne({ student_id }).lean();

        if (!user) {
            return {
                status: false,
                message: 'Không thể tạo học phí! Không tìm thấy thông tin sinh viên!',
            };
        }

        const tuition = await _Tuition.create({ user_id: user._id, tuition_payment });

        if (!tuition) {
            return {
                status: false,
                message: 'Xảy ra lỗi trong quá trình tạo học phí! Vui lòng thử lại sau!',
            };
        }

        return {
            status: true,
            message: `Tạo học phí cho sinh viên với MSSV: ${student_id} thành công!`,
            data: tuition,
        };
    } catch (error) {
        console.error(error);
        return {
            status: false,
            message: error.message,
        };
    }
};

const getTuitions = async function ({ student_id }) {
    try {
        if (!student_id) {
            return { status: false, message: 'Vui lòng điền MSSV hợp lệ để kiểm tra học phí!' };
        }

        const student = await _User.findOne({ student_id: student_id }).lean();

        if (!student) {
            return {
                status: false,
                message: `Không tìm thấy sinh viên nào với MSSV ${student_id} !`,
            };
        }

        const studentTuitions = await _Tuition
            .find({ user_id: student._id, state: TUITION_STATE_UNPAID })
            .sort({ createdAt: 1 })
            .lean();

        return {
            status: true,
            message: 'Kiểm tra học phí của sinh viên thành công!',
            data: {
                tuitions: studentTuitions,
                student_information: {
                    full_name: student.full_name,
                },
            },
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

const validateTuition = async function ({ user_id: sendFrom }, { tuition_id }) {
    try {
        if (!sendFrom || !tuition_id) {
            return {
                status: false,
                message: 'Vui lòng điền đầy đủ thông tin để tiến hành thanh toán học phí!',
            };
        }

        const studentTuition = await _Tuition.findById(tuition_id).lean();

        if (!studentTuition) {
            return {
                status: false,
                message: 'Không tìm thấy thông tin học phí! Vui lòng thử lại sau!',
            };
        }

        if (studentTuition.state === TUITION_STATE_PAID) {
            return {
                status: false,
                message: 'Học phí đã được thanh toán!',
            };
        }

        const payBy = await _User.findById(sendFrom).lean();

        if (!payBy) {
            return {
                status: false,
                message: 'Không tìm thấy thông tin người thanh toán! Vui lòng thử lại sau!',
            };
        }

        if (payBy.balance < studentTuition.tuition_payment) {
            return {
                status: false,
                message:
                    'Số dư tài khoản hiện không đủ để thanh toán học phí! ' +
                    'Hệ thống chỉ cho phép thanh toán toàn bộ giá trị ' +
                    'học phí trong một giao dịch',
            };
        }

        // Validate oke -> Generate OTP
        return await generateOTP(payBy.email, tuition_id);
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    createTuition,
    getTuitions,
    validateTuition,
};
