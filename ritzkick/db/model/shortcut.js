const mongoose = require('mongoose')
const validator = require('validator').default

const shortcutSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    maxUse: {
        type: Number,
        default: 0
    },
    destroyable: {
        type: Boolean,
        required: true
    },
    visits: {
        type: Number,
        default: 0
    }
})

const Shortcut = mongoose.model('Shorcut', shortcutSchema)

module.exports = Shortcut