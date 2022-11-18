const { Schema, model } = require('mongoose');

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

        is_activate: {
            type: Schema.Types.Boolean,
            required: true,
            default: false,
        },

        request_reset_password: {
            type: Schema.Types.Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const UserSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.String,
            unique: true,
            required: true,
            index: true,
        },

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

        gender: {
            type: Schema.Types.String,
            default: 'Khác',
            enum: ['Nam', 'Nữ', 'Khác'],
        },

        avatar: {
            type: Schema.Types.String,
            default: null,
        },

        salary: {
            type: Schema.Types.Number,
            default: 0,
        },

        department_id: {
            type: Schema.Types.String,
            required: true,
        },

        role_id: {
            type: Schema.Types.String,
            ref: 'Role',
            required: true,
        },

        add_by: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        account: {
            type: AccountSchema,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = model('User', UserSchema);
