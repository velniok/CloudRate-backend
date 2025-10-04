const express = require('express')
const cors = require('cors')
require('dotenv').config();
const router = require('./routers/index')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cors())

app.use(router)

app.listen(process.env.PORT || 5000, async (err) => {
    if (err) {
        return console.log(err)
    }

    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('DB ok'))
    .catch(err => console.log('DB error:', err))

    console.log('Server OK')
})