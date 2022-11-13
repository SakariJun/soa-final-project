const { Schema, model } = require('mongoose');
const { TUITION_STATE_UNPAID, TUITION_STATE_PAID } = require('../constants/tuition.constant');

const TuitionSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        tuition_payment: {
            type: Schema.Types.Number,
            required: true,
        },

        state: {
            type: Schema.Types.Number,
            required: true,
            enum: [TUITION_STATE_UNPAID, TUITION_STATE_PAID],
            default: TUITION_STATE_UNPAID,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = model('Tuition', TuitionSchema);
