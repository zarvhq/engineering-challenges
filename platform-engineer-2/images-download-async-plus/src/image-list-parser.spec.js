const path = require('path')

const { imageListParser } = require('./image-list-parser')

// ensure to never return a mock
jest.unmock('./image-list-parser')

describe('parse list', () => {
  it('should return the `images` list from the file sourced', async () => {
    const sampleInput = 'test/mock-data/sample-input.json'
    const sampleData = require(path.resolve(sampleInput))

    await expect(imageListParser(sampleInput))
      .resolves
      .toMatchObject(sampleData.images)
  })

  it('should return error for empty `images` value from the file sourced', async () => {
    await expect(imageListParser('test/mock-data/empty-attribute.json'))
      .rejects
      .toMatch('the images list is empty')
  })

  it('should return error for wrong `images` attribute from the file sourced', async () => {
    await expect(imageListParser('test/mock-data/wrong-attribute.json'))
      .rejects
      .toMatch('the json file need to have an attribute \'images\' with a valid list of image links')
  })
})
