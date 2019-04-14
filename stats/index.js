const express = require('express')
const si = require('systeminformation')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, { path: '/stats/io' })

app.use('/stats', express.static('static'))
app.get('/')

setInterval(async () => {
  const memory = await si.mem()
  io.emit('stats', {
    usedMemory: memory.active,
    freeMemory: memory.available
  })
}, 500)

io.on('connection', () => console.log('> Someone connected'))

http.listen(8001, () => console.log('> Listening on http://localhost:8001'))