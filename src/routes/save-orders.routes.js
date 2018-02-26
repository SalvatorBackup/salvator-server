const express = require('express')
const Joi = require('joi')
const HRT = require('@xstoudi/human-readable-time')

const SaveOrder = require('../models/save-order.model')
const AgentCommunication = require('../agent-communication')

const saveOrdersRouter = express.Router()

saveOrdersRouter
  .get('/', async (req, res) => {
    res.status(200).send((await SaveOrder.find()).map(saveOrder => ({ ...saveOrder, interval: HRT.secondsToHRT(saveOrder.interval) })))
  })
  .post('/', async (req, res) => {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      includes: Joi.string().required(),
      excludes: Joi.string().allow('').optional(),
      interval: Joi.string().required(),
    }).required()

    const result = Joi.validate(req.body, schema)

    if (result.error !== null)
      return res.status(409).send(result.error.details[0].message)

    const newOrder = await SaveOrder.create(
      req.body.name,
      req.body.includes,
      req.body.excludes,
      HRT.hrtToSeconds(req.body.interval)
    )
    res.status(201).send(newOrder);
  })
  .delete('/:id', async (req, res) => {
    const toDelete = await SaveOrder.getById(req.params.id)

    if (toDelete === undefined)
      return res.sendStatus(404)

    await SaveOrder.remove(toDelete)
    res.status(200).send({})
  })

module.exports = saveOrdersRouter
