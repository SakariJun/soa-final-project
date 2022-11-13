const { Schema, model } = require('mongoose');

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

        student_id: {
            type: Schema.Types.String,
            unique: true,
            required: true,
        },

        balance: {
            type: Schema.Types.Number,
            default: 0,
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
