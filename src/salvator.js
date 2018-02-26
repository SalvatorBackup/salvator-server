const slug = require('@slynova/slug')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

const AgentCommunication = require('./agent-communication')
const Settings = require('./settings')

class SaveRunner {

  runnerId = -1
  agent = undefined
  saveOrder = undefined

  static runningRunners = []

  constructor(planningId, agent, saveOrder) {
    this.planningId = planningId
    this.agent = agent
    this.saveOrder = saveOrder

    this.agentCommunication = new AgentCommunication({ ...agent })
  }

  run() {
    this.runnerId = setInterval(() => this.save(), this.saveOrder.interval * 1000)
    SaveRunner.runningRunners = { ...SaveRunner.runningRunners, [this.planningId]: this }
  }

  async save() {
    console.log(`Send save order ${this.saveOrder.name} on ${this.agent.name}`)

    const x = await this.agentCommunication.saveOrder({
      ...this.saveOrder,
      includes: this.saveOrder.includes.split(';').map(str => str.trim())
    }).catch(err => console.log('failed to save order...'))
    // TODO : better catch

    if(x.data === undefined)
      return

    // Update last contact
    this.agent.lastContact = Date.now()
    this.agent.save()

    const filePath = path.join(
      Settings.BACKUP_DIR,
      slug(this.agent.name.toLowerCase()),
      slug(this.saveOrder.name.toLowerCase()),
      `${new Date().toLocaleString().replace(' ', '_')}.zip`
    )

    mkdirp(path.dirname(filePath), err => {
      const ws = fs.createWriteStream(filePath)
      x.data.pipe(ws)
    })
  }

  stop() {
    clearTimeout(this.runnerId)
    delete SaveRunner.runningRunners[this.planningId]
  }

  static getRunner(planningId) {
    return SaveRunner.runningRunners[planningId]
  }

  static init() {
    return new Promise(async resolve => {
      console.log('Loading save runners from database...')
      const plannings = await Planning.find()
      plannings.map(planning => new SaveRunner(planning.id, planning.agent, planning.saveOrder)).forEach(saveRunner => saveRunner.run())
      console.log('Save runners loaded from database')
      resolve()
    })
  }
}

module.exports = SaveRunner
// This is to fix circular dependency mess, WTF dudes
var Planning = require('./models/planning.model')
