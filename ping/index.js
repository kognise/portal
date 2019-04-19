const express = require('express')
const mongoose = require('mongoose')
const app = express()

mongoose.connect(`mongodb://mongo:27017/ping`, { useNewUrlParser: true })

app.use('/ping', express.static('demo'))

app.listen(80, () => console.log('> Listening!'))