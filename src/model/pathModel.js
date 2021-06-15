const mongoose = require('mongoose')
const stations = require('./stationsModel')
const paths = new mongoose.Schema({

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
    stations:
        [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'stations'
        }]

    ,
    description: {
        type: String,
        required: true,
        trim: true,
    }

})
const path = mongoose.model('paths', paths)
module.exports = path

