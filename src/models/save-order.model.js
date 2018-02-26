const {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} = require('typeorm')

@Entity()
class SaveOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = undefined

  @Column('varchar')
  name = undefined

  @Column('text')
  includes = undefined

  @Column('text')
  excludes = undefined

  @Column('bigint')
  interval = undefined

  @OneToMany(type => 'Planning', planning => planning.saveOrder)
  plannings = undefined

  static create(name, includes, excludes, interval) {
    const saveOrder = new SaveOrder()

    saveOrder.name = name
    saveOrder.includes = includes
    saveOrder.excludes = excludes
    saveOrder.interval = interval

    return saveOrder.save()
  }

  static getById(id){
    return SaveOrder.findOneById(id)
  }
}

module.exports = SaveOrder
