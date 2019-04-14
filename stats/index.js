const express = require('express')
const si = require('systeminformation')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, { path: '/stats/io' })

app.use('/stats', express.static('static'))
app.get('/')

setInterval(async () => {
  const memory = await si.mem()
  const portalRes = await si.inetChecksite('https://portal.kognise.dev/')
  const statsRes = await si.inetChecksite('https://portal.kognise.dev/stats')
  const disk = await si.fsStats()
  io.emit('stats', {
    usedMemory: memory.active,
    freeMemory: memory.available,
    portalLatency: portalRes.ms,
    statsLatency: statsRes.ms,
    readIo: disk.rx_sec < 0 ? 0 : disk.rx_sec,
    writeIo: disk.wx_sec < 0 ? 0 : disk.wx_sec
  })
}, 1000)

io.on('connection', () => console.log('> Someone connected'))

http.listen(8001, () => console.log('> Listening on http://localhost:8001/stats'))