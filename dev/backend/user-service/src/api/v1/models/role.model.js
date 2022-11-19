const { Schema, model } = require('mongoose');

const RoleSchema = Schema(
    {
        role_id: {
            type: Schema.Types.Number,
            unique: true,
            index: true,
        },

        name: {
            type: Schema.Types.String,
            required: true,
            unique: true,
        },

        description: {
            type: Schema.Types.String,
        },

        permissions: {
            type: Schema.Types.Number,
            default: 0,
        },
    },
    {
        timestamp: true,
    },
);

module.exports = model('Role', RoleSchema);
