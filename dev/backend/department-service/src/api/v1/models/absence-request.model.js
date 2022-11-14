const { Schema, model } = require('mongoose');

const AbsenceRequestSchema = Schema(
    {
        request_id: {
            type: Schema.Types.ObjectId,
            ref: 'Absence',
            require: true,
        },

        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        },

        date_begin: {
            type: Schema.Types.Date,
            default: new Date(),
        },
        date_end: {
            type: Schema.Types.Date,
            default: new Date(),
        },

        reason: {
            type: Schema.Types.String,
        },

        status: {
            type: Schema.Types.Number,
        },

        request_time: {
            type: Schema.Types.Date,
            default: new Date(),
        },

        response_message: {
            type: Schema.Types.String,
        },

        response_time: {
            type: Schema.Types.Date,
        },
    },
    {
        timestamp: true,
    },
);

module.exports = model('AbsenceRequest', AbsenceRequestSchema);
