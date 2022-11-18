const { Schema, model } = require('mongoose');
const {
    ABSENCE_REQUEST_STATE_WAITING,
    ABSENCE_REQUEST_STATE_APPROVED,
    ABSENCE_REQUEST_STATE_REFUSED,
} = require('../constants/global.constant');

const AbsenceRequestSchema = Schema(
    {
        user_id: {
            type: Schema.Types.String,
            require: true,
            index: true,
        },

        date_begin: {
            type: Schema.Types.Date,
            require: true,
            default: new Date(),
        },
        date_end: {
            type: Schema.Types.Date,
            require: true,
            default: new Date(),
        },

        reason: {
            type: Schema.Types.String,
            require: true,
        },

        status: {
            type: Schema.Types.Number,
            enum: [ABSENCE_REQUEST_STATE_WAITING, ABSENCE_REQUEST_STATE_APPROVED, ABSENCE_REQUEST_STATE_REFUSED],
            default: ABSENCE_REQUEST_STATE_WAITING,
        },

        request_time: {
            type: Schema.Types.Date,
            default: new Date(),
        },

        response_message: {
            type: Schema.Types.String,
            default: null,
        },

        response_time: {
            type: Schema.Types.Date,
            default: null,
        },
    },
    {
        timestamp: true,
    },
);

module.exports = model('AbsenceRequest', AbsenceRequestSchema);
