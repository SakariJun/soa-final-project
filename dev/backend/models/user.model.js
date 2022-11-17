const { Schema, model } = require('mongoose');

// Thông tin nghỉ phép của nhân viên
const AbsenceSchema = Schema(
    {
        max_absence_day: {
            type: Schema.Types.Number,
            require: true,
            default: 12,
        },

        day_absence: {
            type: Schema.Types.Number,
            require: true,
            default: 0,
        },

        last_absence_request: {
            type: Schema.Types.Date,
            require: true,
            default: new Date(),
        },
    },
    {
        timestamps: true,
    },
);

// Tài khoản
const AccountSchema = new Schema(
    {
        username: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: Schema.Types.String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const UserSchema = new Schema(
    {
        full_name: {
            type: Schema.Types.String,
            required: true,
        },

        phone_number: {
            type: Schema.Types.String,
            unique: true,
            required: true,
        },

        email: {
            type: Schema.Types.String,
            unique: true,
            required: true,
        },

        day_of_birth: {
            type: Schema.Types.Date,
            default: new Date(),
        },

        avatar_url: {
            type: Schema.Types.String,
        },

        department_id: {
            type: Schema.Types.ObjectId,
            ref: 'Department',
            required: true,
        },

        role_id: {
            type: Schema.Types.String,
            ref: 'Role',
            required: true,
        },

        account: {
            type: AccountSchema,
            required: true,
        },

        absence: {
            type: AbsenceSchema,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = model('User', UserSchema);
