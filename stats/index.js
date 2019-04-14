const express = require('express')
const si = require('systeminformation')
const exec = require('child_process').exec

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, { path: '/stats/io' })

app.use('/stats', express.static('static'))
app.get('/')

let lastPacketStats
function packetStats(iface) {
  return new Promise((resolve) => {
    let rx = 0
    let tx = 0
    exec(`cat /sys/class/net/${iface}/statistics/rx_packets`, (err, result) => {
      if (!err) {
        rx = parseInt(result)
      }
      
      exec(`cat /sys/class/net/${iface}/statistics/tx_packets`, (err, result) => {
        if (!err) {
          tx = parseInt(result)
        }
        if (!lastPacketStats) {
          resolve({ rx: -1, tx: -1 })
        } else {
          resolve({ rx: rx - lastPacketStats.rx, tx: tx - lastPacketStats.tx })
        }
        lastPacketStats = { rx, tx }
      })
    })
  })
}

setInterval(async () => {
  const memory = await si.mem()
  const portalRes = await si.inetChecksite('https://portal.kognise.dev/')
  const statsRes = await si.inetChecksite('https://portal.kognise.dev/stats')
  const disk = await si.fsStats()
  const network = await si.networkStats('*')
  const fn = network.filter(({ iface }) => iface !== 'lo')
  const packets = await packetStats(fn[0].iface)
  const storage = await si.fsSize()
  const storageReduced = storage.reduce((accumulator, current) => {
    accumulator.used += current.used
    accumulator.free += current.size - current.used
    return accumulator
  }, { used: 0, free: 0 })

  io.emit('stats', {
    usedMemory: memory.active,
    freeMemory: memory.available,
    portalLatency: portalRes.ms,
    statsLatency: statsRes.ms,
    readIo: disk.rx_sec,
    writeIo: disk.wx_sec,
    networkTx: fn[0].tx_sec,
    networkRx: fn[0].rx_sec,
    packetsTx: packets.tx,
    packetsRx: packets.rx,
    storageUsed: storageReduced.used,
    storageFree: storageReduced.free
  })
}, 1000)

io.on('connection', () => console.log('> Someone connected'))

http.listen(8001, () => console.log('> Listening on http://localhost:8001/stats'))