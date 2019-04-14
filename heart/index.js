const uuid = require('uuid/v4')
const express = require('express')
const app = express()

const sessions = {}

app.get('/heart', (req, res) => {
  res.send(Object.keys(sessions).length.toString())
})

app.get('/heart/register', (req, res) => {
  const id = uuid()
  sessions[id] = Date.now()
  res.send(id)
})

app.get('/heart/beat/:session', (req, res) => {
  if (req.params.session in sessions) {
    sessions[req.params.session] = Date.now()
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
})

app.get('/heart/beat', (req, res) => {
  res.sendFile('beat.js', { root: __dirname })
})

app.get('/heart/demo', (req, res) => {
  res.sendFile('demo.html', { root: __dirname })
})

setInterval(() => {
  for (let id in sessions) {
    if (Date.now() - sessions[id] > 2000) {
      delete sessions[id]
    }
  }
})

app.listen(8002, () => console.log('> Listening on http://localhost:8002/heart'))