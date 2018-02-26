const {
  createConnection
} = require('typeorm')
const path = require('path')

class Database {
  static init() {
    return createConnection({
      type: process.env.DB_TYPE || 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'salvator',
      synchronize: true,
      entities: [path.join(__dirname, 'models/*.model.js')],
      logging: true
    })
  }
}

module.exports = Database
