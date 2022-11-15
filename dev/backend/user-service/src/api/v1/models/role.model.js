const { Schema, model } = require('mongoose');

const RoleSchema = Schema(
    {
        role_name: {
            type: Schema.Types.String,
            required: true,
            unique: true,
        },

        role_description: {
            type: Schema.Types.String,
        },

        permissions: {
            type: Schema.Types.Array,
            required: true,
            default: [],
        },
    },
    {
        timestamp: true,
    },
);

module.exports = model('Role', RoleSchema);
