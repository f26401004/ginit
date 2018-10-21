const fs = require('fs')
const path = require('path')

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd())
  },
  directoryExisits: (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory()
    } catch (error) {
      return false
    }
  }
}