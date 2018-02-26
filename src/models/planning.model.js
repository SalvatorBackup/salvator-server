const {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  AfterInsert,
  BeforeRemove
} = require('typeorm')

const SaveRunner = require('../salvator')

const Agent = require('./agent.model')
const SaveOrder = require('./save-order.model')

@Entity()
class Planning extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = undefined

  @ManyToOne(type => 'Agent', agent => agent.plannings, { eager: true })
  agent = undefined

  @ManyToOne(type => 'SaveOrder', saveOrder => saveOrder.plannings, { eager: true })
  saveOrder = undefined

  @AfterInsert()
  afterInsert() {
    new SaveRunner(this.id, this.agent, this.saveOrder).run()
  }

  @BeforeRemove()
  beforeRemove() {
    SaveRunner.getRunner(this.id).stop()
  }

  static create(agent, saveOrder) {
    const planning = new Planning()

    planning.agent = agent
    planning.saveOrder = saveOrder

    return planning.save()
  }

  static getById(id) {
    return Planning.findOneById(id)
  }
}

module.exports = Planning
