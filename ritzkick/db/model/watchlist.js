const mongoose = require('mongoose')

const watchlistSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    asset: {
        type: mongoose.Types.ObjectId,
        required: true,
        trim: true
    },
    target: {
        type: Number,
        required: true,
        validate(target) {
            if (target < 0) {
                throw new Error('Target cannot be set under 0.')
            }
        }
    }
}, {
    timestamps: true
})

const Watchlist = mongoose.model('Watchlist', watchlistSchema)

module.exports = Watchlist