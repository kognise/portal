const express = require('express')
const app = express()

app.use('/stats', express.static('static'))

app.listen(8001, () => console.log('> Listening on http://localhost:8001'))