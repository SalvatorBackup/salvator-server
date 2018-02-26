require('babel-polyfill');
require('reflect-metadata')
const Settings = require('./settings')

const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: '5a391a3450cb419c88d9ff3a0a4653c7',
  captureUncaught: true,
  captureUnhandledRejections: true
})

;(async () => {
  const express = require('express')
  const bodyParser = require('body-parser')

  const SaveRunner = require('./salvator')
  const Database = require('./database')
  const agentsRouter = require('./routes/agents.routes')
  const saveOrdersRouter = require('./routes/save-orders.routes')
  const planningsRouter = require('./routes/plannings.routes')
  const settingsRouter = require('./routes/settings.routes')

  // DATABASE
  await Database.init()

  // SAVE RUNNERS
  await SaveRunner.init()

  // API
  const app = express()

  app
    .use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
      next()
    })
    .use((req, res, next) => {
      if(req.method === 'OPTIONS' || req.headers['authorization'] === Settings.DASHBOARD_PASSWORD)
        return next()

      res.status(401).send('Bad pass')
    })
    .use(bodyParser.json())
    .use('/api/agents', agentsRouter)
    .use('/api/save-orders', saveOrdersRouter)
    .use('/api/plannings', planningsRouter)
    .use('/api/settings', settingsRouter)
    .use(express.static('public'));


  app.listen(process.env.HTTP_PORT || 8080, () => console.log(`Server listening on port ${process.env.HTTP_PORT || 8080}`))
})()
