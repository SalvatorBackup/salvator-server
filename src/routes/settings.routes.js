const express = require('express')

const Settings = require('../settings')

const settingsRouter = express.Router()

settingsRouter
  .get('/', async (req, res) => {
    res.status(200).send(Settings.get())
  })

module.exports = settingsRouter
