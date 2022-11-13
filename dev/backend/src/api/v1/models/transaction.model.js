const { Schema, model } = require('mongoose');
const { TRANSACTION_TYPE_PAID_TUITION } = require('../constants/transaction.constant');

const TransactionSchema = new Schema(
    {
        send_from: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        send_to: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        amount: {
            type: Schema.Types.Number,
            required: true,
            default: 0,
        },

        type: {
            type: Schema.Types.Number,
            enum: [TRANSACTION_TYPE_PAID_TUITION],
            default: TRANSACTION_TYPE_PAID_TUITION,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = model('Transaction', TransactionSchema);
