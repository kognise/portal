const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.text())

function reverse(string = '') {
  return [ ...string ].reverse().join('')
}

app.use('/revers', express.static('demo'))

app.post('/revers', (req, res) => {
  res.send(reverse(req.body))
})

app.get('/revers/:string', (req, res) => {
  res.send(reverse(req.params.string))
})

app.listen(80, () => console.log('> Listening!'))