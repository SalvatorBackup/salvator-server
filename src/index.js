require('babel-polyfill');
require('reflect-metadata')
const Settings = require('./settings')

const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: '5a391a3450cb419c88d9ff3a0a4653c7',
  captureUncaught: true,
  captureUnhandledRejections: true
})

;
(async () => {
  const express = require('express')
  const bodyParser = require('body-parser')
  const session = require('express-session')
  const cors = require('cors')

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
    .set('trust proxy', 1)
    .use(session({
      secret: Settings.SESS_SECRET,
      saveUninitialized: true,
      resave: false
    }))
    .use(cors({
      origin: true,
      credentials: true
    }))
    .use(bodyParser.json())
    .post('/api/login', (req, res) => {
      if (req.body.password === Settings.DASHBOARD_PASSWORD) {
        req.session.isAuth = true
        res.status(200).send({})
      } else {
        res.status(401).send('Bad pass')
      }
    })
    .use((req, res, next) => {
      if (req.method === 'OPTIONS' || req.session.isAuth === true)
        return next()
      else
        res.status(401).send('Please auth')
    })
    .use('/api/agents', agentsRouter)
    .use('/api/save-orders', saveOrdersRouter)
    .use('/api/plannings', planningsRouter)
    .use('/api/settings', settingsRouter)
    .use(express.static('public'));


  app.listen(process.env.HTTP_PORT || 8080, () => console.log(`Server listening on port ${process.env.HTTP_PORT || 8080}`))
})()
