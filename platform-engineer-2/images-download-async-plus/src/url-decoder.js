const { URL } = require('url')

const getFolderName = (url) => {
  const host = new URL(url).host
  return host.replace('www.', '').replace('.com', '')
}

const getImageName = (url) => {
  const urlParts = url.split('/')
  return urlParts[urlParts.length - 1]
}

module.exports = { getFolderName, getImageName }
