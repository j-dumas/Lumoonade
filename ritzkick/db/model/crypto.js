const mongoose = require('mongoose')

const cryptoSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    apis: []
}, {
    timestamps: true
})

const Crypto = mongoose.model('Crypto', cryptoSchema)

module.exports = Crypto