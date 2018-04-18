const path = require('path')
const fs = require('fs')

class StorageConfigManager {

  static _path = path.join(__dirname, '..', 'storage-config.json')

  static get() {
    return new Promise(resolve => {
      fs.readFile(StorageConfigManager._path, (err, data) => {
        if (err) throw err
        resolve(JSON.parse(data.toString()))
      })
    })
  }

  static async switchDriver(driverName){
    const currentFile = await StorageConfigManager.get()
    currentFile.activeDriver = (currentFile.activeDriver === driverName ? null : driverName)
    return StorageConfigManager._write(currentFile)
  }

  static async setDriverConfig(driverName, newConfig) {
    const currentFile = await StorageConfigManager.get()
    currentFile.availableDrivers[driverName].config = newConfig
    return StorageConfigManager._write(currentFile)
  }

  static _write(newFile) {
    return new Promise(resolve => {
      fs.writeFile(StorageConfigManager._path, JSON.stringify(newFile, null, 2), err => {
        if (err) throw err
        resolve(newFile)
      })
    })
  }
}

module.exports = StorageConfigManager
