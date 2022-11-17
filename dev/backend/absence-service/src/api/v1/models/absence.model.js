const { Schema, model } = require('mongoose');

// Thông tin nghỉ phép của nhân viên
const AbsenceSchema = Schema(
    {
        user_id: {
            type: Schema.Types.String,
            unique: true,
            index: true,
            required: true,
        },

        max_absence_day: {
            type: Schema.Types.Number,
            require: true,
            default: 12,
        },

        day_absence: {
            type: Schema.Types.Number,
            default: 0,
        },

        last_absence_request: {
            type: Schema.Types.Date,
            default: new Date(),
        },
    },
    {
        timestamps: true,
    },
);

module.exports = model('Absence', AbsenceSchema);
