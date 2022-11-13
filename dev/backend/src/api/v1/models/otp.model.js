const { Schema, model } = require('mongoose');
const { OTP_EXPIRE_TIME } = require('../constants/otp.constant');

const OtpSchema = new Schema(
    {
        otp: {
            type: Schema.Types.String,
            required: true,
        },

        email: {
            type: Schema.Types.String,
            required: true,
            index: true,
        },

        tuition_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Tuition',
        },

        time: {
            type: Schema.Types.Date,
            default: Date.now,
            expires: OTP_EXPIRE_TIME,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = model('OTP', OtpSchema);
