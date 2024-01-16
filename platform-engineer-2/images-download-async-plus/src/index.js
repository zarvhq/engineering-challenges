#!/usr/bin/env node

const winston = require('winston')
const { imageListParser } = require('./image-list-parser')
const { downloader } = require('./downloader')

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
})

const init = () => {
  if (process.argv[2] === undefined) {
    logger.error('the first argument must be a path to a valid json file')
    return
  }

  if (process.argv[3] === undefined) {
    logger.error('the second argument must be the name of a destination folder')
    return
  }

  const input = process.argv[2]
  const output = process.argv[3]

  logger.info(`source file name: ${input}`)
  logger.info(`destination folder: ${output}`)

  return imageListParser(input)
    .then((imageList) => downloader(imageList, output))
    .then((response) => {
      response.forEach(element => {
        if (typeof element === 'string') {
          logger.info(`file downloaded: ${element}`)
        } else {
          logger.error(`${element}`)
        }
      })
    })
    .catch((error) => logger.error(error))
}

init()
