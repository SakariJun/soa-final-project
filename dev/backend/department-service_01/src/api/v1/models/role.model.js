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
    },
    {
        timestamp: true,
    },
);

module.exports = model('Role', RoleSchema);
