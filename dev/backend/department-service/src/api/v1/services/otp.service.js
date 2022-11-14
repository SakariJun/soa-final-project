const bcrypt = require('bcrypt');
const { startSession } = require('mongoose');
const otpGenerator = require('otp-generator');

const { sendMail } = require('../utils/send-mail.util');
const { _OTP, _Tuition } = require('../models');
const { TUITION_STATE_PAID } = require('../constants/tuition.constant');
const { createTransaction } = require('../services/transaction.service');

const generateOTP = async function (email, tuition_id) {
    const session = await startSession();

    try {
        const checkAlreadyRequest = await _OTP.findOne({ email, tuition_id });

        if (checkAlreadyRequest) {
            return {
                status: true,
                message:
                    'Bạn đã yêu cầu mã OTP cho giao dịch này! Vui lòng kiểm tra email để nhận mã OTP! ' +
                    'Trong trường hợp không nhận được email vui lòng đợi 5 phút sau để có thể yêu cầu một mã OTP khác!',
            };
        }

        const OTP_LENGTH = 6;
        const otp = otpGenerator.generate(OTP_LENGTH, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);

        session.startTransaction();

        const OTP = await _OTP.create(
            [
                {
                    email,
                    otp: hashedOTP,
                    tuition_id,
                },
            ],
            {
                session,
            },
        );

        if (!OTP) {
            return {
                status: false,
                message: 'Có lỗi trong quá trình tạo mã OTP! Vui lòng thử lại sau!',
            };
        }

        const mailSubject = 'I-Banking OTP System Auto Mail';
        const mailContent =
            `Mã OTP của bạn cho giao dịch thanh toán học phí với ID: ${tuition_id} là: ${otp}\n` +
            `Mã OTP sẽ hết hiệu lực sau 5 phút!`;

        const sendMailResult = await sendMail(email, mailSubject, mailContent);

        if (!sendMailResult.status) {
            await session.abortTransaction();
            return sendMailResult;
        }

        await session.commitTransaction();
        return {
            status: true,
            message: 'Mã OTP đã được gửi đến email của người thanh toán! Vui lòng kiểm tra email!',
        };
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return { status: false, message: error.message };
    } finally {
        await session.endSession();
    }
};

const verifyOTP = async function ({ user_id, email }, { otp, tuition_id }) {
    try {
        if (!otp || !tuition_id) {
            return { status: false, message: 'Vui lòng nhập mã OTP và mã giao dịch học phí!' };
        }

        const tuition = await _Tuition.findById(tuition_id).lean();

        if (!tuition) {
            return { status: false, message: 'Không tìm thấy học phí tương ứng! Vui lòng thử lại sau!' };
        }

        if (tuition.state === TUITION_STATE_PAID) {
            return { status: true, message: `Học phí với mã ${tuition._id} đã được thanh toán!` };
        }

        const validOTP = await _OTP.findOne({ email, tuition_id }).lean();

        if (!validOTP) {
            return { status: false, message: 'Mã OTP đã hết hiệu lực!' };
        }

        if (!(await bcrypt.compare(otp.toString(), validOTP.otp))) {
            return { status: false, message: 'Mã OTP không hợp lệ!' };
        }

        const createTransactionResult = await createTransaction(user_id, tuition_id);

        if (!createTransactionResult.status) {
            return createTransactionResult;
        }

        return {
            status: true,
            message: 'Thanh toán học phí thành công! Thông tin giao dịch sẽ được gửi đến email của người thanh toán!',
            data: {
                user_new_balance: createTransactionResult.data.user_new_balance,
            },
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    generateOTP,
    verifyOTP,
};
