const { Schema, model } = require('mongoose');

const AbsenceSchema = Schema({
    request_id: {
        type: Schema.Types.ObjectId,
        ref: 'absence',
        require: true,
    },

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true,
    },

    date_begin: {
        type: Schema.Types.,
        
    },
    date_end: {
        type: Schema.Types.,

    },
    reason: {
        type: Schema.Types.,

    },
    status: {
        type: Schema.Types.,

    },
    request_time: {
        type: Schema.Types.,

    },
    response_message:{
        type: Schema.Types.,

    } ,
    response_time: {
        type: Schema.Types.,

    },
});

module.exports = model('absence', AbsenceSchema);
