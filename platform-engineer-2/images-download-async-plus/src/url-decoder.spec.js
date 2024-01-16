const { getFolderName, getImageName } = require('./url-decoder')

describe('decode folder name', () => {
  it('w3schools', async () => {
    const url = 'https://www.w3schools.com/w3css/img_lights.jpg'
    expect(getFolderName(url)).toBe('w3schools')
  })

  it('google.com', async () => {
    const url = 'https://www.google.images.com/img_lights.jpg'
    expect(getFolderName(url)).toBe('google.images')
  })
})

describe('decode file name', () => {
  it('w3 filename', async () => {
    const url = 'https://www.w3schools.com/w3css/img_lights.jpg'
    expect(getImageName(url)).toBe('img_lights.jpg')
  })

  it('google filename', async () => {
    const url = 'https://www.google.images.com/img_lights.jpg'
    expect(getImageName(url)).toBe('img_lights.jpg')
  })
})
