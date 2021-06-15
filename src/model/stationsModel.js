const mongoose = require('mongoose')

const stations = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    id: {
        type: Number,
        required: true,
        unique: true,
        validate(value) {
            if (value < 0) {
                throw new Error('id must be a postive number')
            }
        }
    },
    type: {
        type: String,
        required: true,
        trim: true,

    },
    description: {
        type: String,
        required: true,
        trim: true,

    },
    path:

    {
        type: Array,
        required: true
    }

})


const station = mongoose.model('stations', stations)
module.exports = station


