const fs = require('fs')

const imageListParser = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const obj = JSON.parse(data)

      if (obj.images === undefined || obj.images === null) {
        reject('the json file need to have an attribute \'images\' with a valid list of image links')
        return
      }

      if (!obj.images.length) {
        reject('the images list is empty')
        return
      }

      resolve(obj.images)
    })
  })
}

module.exports = { imageListParser }
