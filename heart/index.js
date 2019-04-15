const uuid = (a) => a ? (a ^ Math.random() * 16 >> a / 4).toString(16):([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b)
const express = require('express')
const app = express()

const sessions = {}

app.get('/heart', (req, res) => {
  for (let id in sessions) {
    if (Date.now() - sessions[id] > 2000) {
      delete sessions[id]
    }
  }
  res.send(Object.keys(sessions).length.toString())
})

app.get('/heart/beat/:session', (req, res) => {
  if (req.params.session in sessions) {
    sessions[req.params.session] = Date.now()
    res.send(req.params.session)
  } else {
    const id = uuid()
    sessions[id] = Date.now()
    res.send(id)
  }
})

app.get('/heart/beat', (req, res) => {
  res.sendFile('beat.js', { root: __dirname })
})

app.get('/heart/demo', (req, res) => {
  res.sendFile('demo.html', { root: __dirname })
})

app.listen(8002, () => console.log('> Listening on http://localhost:8002/heart'))