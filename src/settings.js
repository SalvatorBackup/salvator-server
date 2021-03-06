const path = require('path')

class Settings {

  static _defaultSettings = {
    DB_TYPE: 'mysql',
    DB_HOST: 'localhost',
    DB_PORT: 3306,
    DB_USERNAME: 'root',
    DB_PASSWORD: '',
    DB_NAME: 'salvator',
    DASHBOARD_PASSWORD: 'SalvatorFTW',
    SESS_SECRET: 'keyboard cat'
  }

  static get(){
    const currentSettings = {}
    Object.keys(Settings._defaultSettings).forEach(key => {
      currentSettings[key] = Settings[key]
    })
    return currentSettings
  }
}

Object.keys(Settings._defaultSettings).forEach(key => {
  Settings[key] = process.env[key] || (
    console.log(`Use default settings for config ${key} --> '${Settings._defaultSettings[key]}'`),
    Settings._defaultSettings[key]
  )
})

module.exports = Settings
