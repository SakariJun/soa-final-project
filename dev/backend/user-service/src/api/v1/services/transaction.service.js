const { startSession } = require('mongoose');
const moment = require('moment');

const { sendMail } = require('../utils/send-mail.util');
const { _Transaction, _User, _Tuition } = require('../models');
const { TRANSACTION_TYPE_PAID_TUITION } = require('../constants/transaction.constant');
const { TUITION_STATE_UNPAID, TUITION_STATE_PAID } = require('../constants/tuition.constant');

const createTransaction = async function (send_from, tuition_id) {
    const session = await startSession();

    try {
        // Step 1: Check is exists send_from and send_to
        // Step 2: Start transaction
        // Step 3: Update tuition payment state
        // Step 4: - send_from balance account
        // Step 5: Send mail to user
        // Done

        if (!send_from || !tuition_id) {
            return { status: false, message: 'Vui lòng điền đầy đủ thông tin để tạo giao dịch!' };
        }

        session.startTransaction();

        const tuition = await _Tuition
            .findOneAndUpdate(
                {
                    _id: tuition_id,
                    state: TUITION_STATE_UNPAID,
                },
                {
                    state: TUITION_STATE_PAID,
                },
                {
                    new: true,
                    session: session,
                },
            )
            .populate({
                path: 'user_id',
                select: 'student_id full_name',
            })
            .lean();

        if (!tuition) {
            await session.abortTransaction();
            return {
                status: false,
                message:
                    'Xảy ra lỗi trong quá trình tạo giao dịch! Không tìm thấy thông tin học phí hoặc học phí đã được thanh toán!',
            };
        }

        const payBy = await _User
            .findOneAndUpdate(
                {
                    _id: send_from,
                },
                {
                    $inc: {
                        balance: -tuition.tuition_payment,
                    },
                },
                {
                    new: true,
                    session: session,
                },
            )
            .lean();

        const user = await _User.findById(tuition.user_id).session(session).lean();

        if (!payBy || !user) {
            await session.abortTransaction();
            return {
                status: false,
                message:
                    'Xảy ra lỗi trong quá trình tạo giao dịch! ' +
                    'Không tìm thấy thông tin người thanh toán và người được thanh toán!',
            };
        }

        const transaction = await _Transaction.create(
            [
                {
                    send_from: send_from,
                    send_to: tuition.user_id,
                    amount: tuition.tuition_payment,
                    type: TRANSACTION_TYPE_PAID_TUITION,
                },
            ],
            {
                session,
            },
        );

        if (transaction.length == 0) {
            await session.abortTransaction();
            return { status: false, message: 'Tạo giao dịch không thành công!' };
        }

        tuition.tuition_payment = tuition.tuition_payment.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
        });

        let createdAt = new Date(transaction[0].createdAt);
        createdAt = moment(createdAt).format('DD/MM/YYYY HH:mm:ss');

        const mailSubject = 'I-Banking OTP System Auto Mail - Xác nhận giao dịch thành công';
        const mailContent = `
            Mã giao dịch: ${transaction[0]._id}\n
            Mã học phí: ${tuition._id}\n

            Sinh viên thanh toán: ${payBy.full_name} - ${payBy.student_id}\n
            Sinh viên thụ hưởng: ${tuition.user_id.full_name} - ${tuition.user_id.student_id}\n

            Giá trị giao dịch: ${tuition.tuition_payment}\n
            Số dư còn lại: ${payBy.balance}\n

            Thời gian giao dịch: ${createdAt}\n

            Loại giao dịch: Thanh toán học phí\n
            Trạng thái: ĐÃ THANH TOÁN\n
        `;
        const sendMailResult = await sendMail(payBy.email, mailSubject, mailContent);

        if (!sendMailResult.status) {
            return sendMailResult;
        }

        await session.commitTransaction();
        // Return user balance here to update user balance in UI
        return {
            status: true,
            message: 'Tạo giao dịch và cập nhật số dư thành công! Vui lòng kiểm tra email để xác nhận giao dịch!',
            data: {
                user_new_balance: payBy.balance,
            },
        };
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        return { status: false, message: error.message };
    } finally {
        await session.endSession();
    }
};

const getTransactions = async function ({ user_id }) {
    try {
        const userTransactions = await _Transaction.find({ sendFrom: user_id });

        // Not check here cause if none userTransaction is found
        // then empty array will be returned
        return {
            status: true,
            message: 'Lấy danh sách giao dịch thành công!',
            data: userTransactions,
        };
    } catch (error) {
        console.error(error);
        return { status: false, message: error.message };
    }
};

module.exports = {
    createTransaction,
    getTransactions,
};
