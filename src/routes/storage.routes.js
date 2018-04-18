const express = require('express')

const Settings = require('../settings')
const StorageConfigManager = require('../storage-config-manager')

const storageRouter = express.Router()

storageRouter
  .get('/', async (req, res) => {
    res.status(200).send(await StorageConfigManager.get())
  })
  .post('/:driverName', async (req, res) => {
    res.status(200).send(await StorageConfigManager.setDriverConfig(req.params.driverName, req.body))
  })
  .post('/', async (req, res) => {
    const driverToSwitch = req.body.switch
    res.status(200).send(await StorageConfigManager.switchDriver(driverToSwitch))
  })

module.exports = storageRouter
