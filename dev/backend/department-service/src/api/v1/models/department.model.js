const { Schema, model } = require('mongoose');

const DepartmentSchema = Schema(
    {
        department_id: {
            type: Schema.Types.String,
            required: true,
            index: true,
            unique: true,
        },

        name: {
            type: Schema.Types.String,
            required: true,
        },

        room: {
            type: Schema.Types.String,
            required: true,
        },

        leader_id: {
            type: Schema.Types.String,
            default: '',
        },

        description: {
            type: Schema.Types.String,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = model('Department', DepartmentSchema);
