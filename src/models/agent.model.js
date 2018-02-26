const {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} = require('typeorm')

@Entity()
class Agent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = undefined

  @Column('varchar')
  name = undefined

  @Column('varchar')
  endpoint = undefined

  @Column('varchar')
  token = undefined

  @Column('bigint')
  lastContact = undefined

  @OneToMany(type => 'Planning', planning => planning.agent)
  plannings = undefined

  static create(name, endpoint, token) {
    const agent = new Agent()

    agent.name = name
    agent.endpoint = endpoint
    agent.token = token
    agent.lastContact = Date.now()

    return agent.save()
  }

  static getById(id){
    return Agent.findOneById(id)
  }
}

module.exports = Agent
