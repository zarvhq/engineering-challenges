import ImageHandler from './handler';

export default async function main(jsonFilePath: string) {
  try {
    const imageHandler = new ImageHandler(jsonFilePath);
    return imageHandler.handle();
  } catch (error) {
    return {
      result: [],
      errors: [error as { errorMessage: string }],
    };
  }
}
