const express = require('express')
const Joi = require('joi')
const HRT = require('@xstoudi/human-readable-time')

const Planning = require('../models/planning.model')
const Agent = require('../models/agent.model')
const SaveOrder = require('../models/save-order.model')
const AgentCommunication = require('../agent-communication')

const planningsRouter = express.Router()

planningsRouter
  .get('/', async (req, res) => {
    res.status(200).send(await Planning.find())
  })
  .post('/', async (req, res) => {
    const schema = Joi.object().keys({
      agent: Joi.number().required(),
      saveOrder: Joi.number().required(),
    }).required()

    const result = Joi.validate(req.body, schema)
    if (result.error !== null)
      return res.status(400).send(result.error.details[0].message)

    const agent = await Agent.getById(req.body.agent)
    if (agent === undefined)
      return res.status(404).send({})
    const saveOrder = await SaveOrder.getById(req.body.saveOrder)
    if (saveOrder === undefined)
      return res.status(404).send({})

    const planning = await Planning.create(agent, saveOrder)
    res.status(200).send(planning)
  })
  .delete('/:id', async (req, res) => {
    const toDelete = await Planning.getById(req.params.id)

    if (toDelete === undefined)
      return res.sendStatus(404)

    await Planning.remove(toDelete)
    res.status(200).send({})
  })

module.exports = planningsRouter
