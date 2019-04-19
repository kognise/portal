const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect(`mongodb://root:${encodeURIComponent(process.env.MONGO_PASSWORD)}@mongo/ping`, { useNewUrlParser: true })

app.use('/ping', express.static('demo'))

app.listen(80, () => console.log('> Listening!'))