const mongoose = require('mongoose')

const url = process.env.DB_URL

mongoose.connect(url, { autoIndex: true })
.then(res => {
    console.log('Connected to the database')
}).catch(err => {
    console.log('Unable to connect to the database', err.message)
})
