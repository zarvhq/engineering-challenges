const axios = require('axios')
const fs = require('fs')
const { getFolderName, getImageName } = require('./url-decoder')

const maxBytes = 100000 // 1mb

const downloader = (imageList, output) => {
  // map all request promises
  return axios.all(imageList.map((url) => {
    // stream each url
    return getStream(url, output)
  }))
}

const getStream = (url, output) => {
  return axios({
    method: 'get',
    url,
    responseType: 'stream' // to be able to pipe the response
  }).then(response => {
    // check content length
    const contentLenth = response.headers['content-length']
    if (contentLenth > maxBytes) {
      return new Error(`${url} content length is: ${contentLenth} bytes (>1mb)`)
    }

    // write to strem
    return writer(response.data, url, output)
  }).catch(e => {
    return new Error(`${url} failed with ${e}`)
  })
}

const writer = (data, url, output) => {
  return new Promise((resolve, reject) => {
    const filename = getImageName(url)
    const folderName = getFolderName(url)

    const folderPath = output + '/' + folderName
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
    }

    const filePath = folderPath + '/' + filename
    const writer = fs.createWriteStream(filePath)

    // pipe to writestream
    data.pipe(writer)

    let error = null
    // if error close the writer
    writer.on('error', err => {
      error = err
      writer.close()
      reject(err) // and reject the promise
    })

    // no need the reject here
    // it will have been called in the 'error' stream
    writer.on('close', () => {
      if (!error) {
        resolve(filePath)
      }
    })
  })
}

module.exports = { downloader }
