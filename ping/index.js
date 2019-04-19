const express = require('express')
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const uid = require('uid-promise')
const formatUrl = require('./format-url')
const app = express()

mongoose.Promise = Promise
mongoose.connect(`mongodb://mongo:27017/ping`, { useNewUrlParser: true })
const Site = mongoose.model('Site', {
  location: String,
  stopCode: String,
  lastCheck: Number
})

app.use('/ping', express.static('demo'))
app.get('/ping/:location', async (req, res) => {
  try {
    const { location } = req.params
    const formatted = formatUrl(location)
    if (!formatted) {
      res.sendStatus(400)
      return
    }

    const count = await Site.count({ location: formatted })
    if (count > 0) {
      res.sendStatus(409)
      return
    }

    await fetch(location)
    const lastCheck = Date.now()

    const stopCode = await uid(20)
    const site = new Site({ location: formatted, stopCode, lastCheck })
    await site.save()
    res.status(201).send(stopCode)
  } catch(error) {
    console.error(error)
    res.sendStatus(500)
  }
})
app.get('/ping/:location/stop/:stopCode', async (req, res) => {
  try {
    const { location, stopCode } = req.params
    const formatted = formatUrl(location)
    if (!formatted || !(stopCode && stopCode.length === 20)) {
      res.sendStatus(400)
      return
    }

    const site = await Site.findOne({ location: formatted })
    if (!site) {
      res.sendStatus(404)
      return
    }
    if (site.stopCode !== stopCode) {
      res.sendStatus(403)
      return
    }

    await site.delete()
    res.sendStatus(204)
  } catch(error) {
    console.error(error)
    res.sendStatus(500)
  }
})
app.get('/ping/:location/last', async (req, res) => {
  try {
    const { location } = req.params
    const formatted = formatUrl(location)
    if (!formatted) {
      res.sendStatus(400)
      return
    }

    const site = await Site.findOne({ location: formatted })
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