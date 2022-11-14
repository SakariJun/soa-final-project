const { Schema, model } = require('mongoose');

const DepartmentSchema = Schema(
    {
        _id: {
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
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },

        description: {
            type: Schema.Types.String,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = model('Department', DepartmentSchema);
