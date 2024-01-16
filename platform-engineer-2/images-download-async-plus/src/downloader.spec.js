const { downloader } = require('./downloader')

const outputFolder = 'my-pictures'

describe('download list', () => {
  it('should download the image list', async () => {
    const imageList = [
      'https://www.w3schools.com/w3css/img_lights.jpg',
      'https://www.w3schools.com/w3css/img_forest.jpg',
      'https://www.w3schools.com/w3css/img_mountains.jpg',
      'https://www.w3schools.com/w3css/img_snowtops.jpg'
    ]

    const expectedOutput = [
      'my-pictures/w3schools/img_lights.jpg',
      'my-pictures/w3schools/img_forest.jpg',
      'my-pictures/w3schools/img_mountains.jpg',
      'my-pictures/w3schools/img_snowtops.jpg'
    ]

    await expect(downloader(imageList, outputFolder))
      .resolves
      .toMatchObject(expectedOutput)
  })

  it('should return 404 for not found image', async () => {
    const imageList = [
      'https://www.w3schools.com/w3css/img_snowtopsss.jpg'
    ]

    const expectedOutput = [new Error('https://www.w3schools.com/w3css/img_snowtopsss.jpg failed with AxiosError: Request failed with status code 404')]

    await expect(downloader(imageList, outputFolder))
      .resolves
      .toMatchObject(expectedOutput)
  })

  it('should return error for invalid url', async () => {
    const imageList = [
      'w3schools/w3css/img_snowtopsss.jpg'
    ]

    const expectedOutput = [new Error('w3schools/w3css/img_snowtopsss.jpg failed with Error: connect ECONNREFUSED 127.0.0.1:80')]

    await expect(downloader(imageList, outputFolder))
      .resolves
      .toMatchObject(expectedOutput)
  })

  it('should return error for larger images', async () => {
    const imageList = [
      'https://www.learningcontainer.com/wp-content/uploads/2020/07/Large-Sample-Image-download-for-Testing.jpg'
    ]

    const expectedOutput = [new Error('https://www.learningcontainer.com/wp-content/uploads/2020/07/Large-Sample-Image-download-for-Testing.jpg content length is: 15483160 bytes (>1mb)')]

    await expect(downloader(imageList, outputFolder))
      .resolves
      .toMatchObject(expectedOutput)
  })
})
