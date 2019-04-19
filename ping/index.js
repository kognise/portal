const express = require('express')
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const isUrl = require('./is-url')
const app = express()

mongoose.Promise = Promise
mongoose.connect(`mongodb://mongo:27017/ping`, { useNewUrlParser: true })
const Site = mongoose.model('Site', {
  location: String,
  lastCheck: Number
})

app.use('/ping', express.static('demo'))
app.get('/ping/:location', async (req, res) => {
  try {
    const { location } = req.params
    if (!isUrl(location)) {
      res.sendStatus(400)
      return
    }

    const count = await Site.count({ location })
    if (count > 0) {
      res.sendStatus(409)
      return
    }

    const site = new Site({ location, lastCheck: 0 })
    await site.save()
    res.sendStatus(201)
  } catch(error) {
    console.error(error)
    res.sendStatus(500)
  }
})
app.get('/ping/:location/stop', async (req, res) => {
  try {
    const { location } = req.params
    if (!isUrl(location)) {
      res.sendStatus(400)
      return
    }

    await Site.findOneAndDelete({ location })
    res.sendStatus(200)
  } catch(error) {
    console.error(error)
    res.sendStatus(500)
  }
})
app.get('/ping/:location/last', async (req, res) => {
  try {
    const { location } = req.params
    if (!isUrl(location)) {
      res.sendStatus(400)
      return
    }

    const site = await Site.findOne({ location })
    if (!site) {
      res.sendStatus(404)
      return
    }
    res.status(200).send(site.lastCheck.toString())
  } catch(error) {
    console.error(error)
    res.sendStatus(500)
  }
})

app.listen(80, () => console.log('> Listening!'))

setInterval(async () => {
  const sites = await Site.find()
  sites.forEach(async (site) => {
    try {
      await fetch(site.location)
      site.lastCheck = Date.now()
      await site.save()
    } catch(error) {
      console.error(error)
    }
  })
}, 1000 * 60 * 5)