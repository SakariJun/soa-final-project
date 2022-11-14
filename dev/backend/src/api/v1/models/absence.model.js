const { Schema, model } = require('mongoose');

const AbsenceSchema = Schema({
    user_id: {
        type: Schema.Type.ObjectId,
        ref: 'user',
        require: true,
        index: true,
    },

    max_absence_day: {
        type: Schema.Type.Number,
        require: true,
    },

    day_absence: {
        type: Schema.Type.Number,
        require: true,
        default: 0,
    },

    last_absence_request: {
        type: Schema.Type.DateTime,
        require: true,
        default: new Date(),
    },
});

module.exports = model('absence', AbsenceSchema);
