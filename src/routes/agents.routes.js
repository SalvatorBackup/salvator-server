const express = require('express')
const Joi = require('joi')

const Agent = require('../models/agent.model')
const AgentCommunication = require('../agent-communication')

const agentsRouter = express.Router()

agentsRouter
  .get('/', async (req, res) => {
    res.status(200).send(await Agent.find())
  })
  .post('/', async (req, res) => {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      endpoint: Joi.string().required(),
      token: Joi.string().required()
    }).required()

    const result = Joi.validate(req.body, schema)

    if (result.error !== null)
      return res.status(409).send(result.error.details[0].message)

    const pong = await (new AgentCommunication({ endpoint: req.body.endpoint, token: req.body.token })).ping().catch(res => {
      if (res.statusCode !== undefined)
        return res
      else
        return {
          statusCode: 400,
          error: res.message
        }
    })
    if (pong.error !== undefined)
      return res.status(pong.statusCode).send(pong.error)

    const agent = await Agent.create(req.body.name, req.body.endpoint, req.body.token).catch(err => {
      res.status(500).send('Failed to save agent')
      return null
    })
    if (agent !== null)
      res.status(201).send(agent)
  })
  .delete('/:id', async (req, res) => {
    const toDelete = await Agent.getById(req.params.id)

    if (toDelete === undefined)
      return res.sendStatus(404)

    await Agent.remove(toDelete)
    res.status(200).send({})
  })
module.exports = agentsRouter
