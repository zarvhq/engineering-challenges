import main from '../src/main';
import path from 'path';

const responseByPathname = (pathname: string) => {
  const mockPath = path.join(process.cwd(), pathname);
  return main(mockPath);
};

describe('ImageHandler', () => {
  it('should return error with image larger than 1MB', async () => {
    const { result, errors } = await responseByPathname(
      './test/mocks/image-too-big.json',
    );

    expect(result.length).toBe(0);
    expect(errors.length).toBe(1);
    expect(errors[0].errorMessage).toContain('Image is bigger than 1MB');
  });

  it('should return error with image larger than 1MB, and the paths of valid images', async () => {
    const { result, errors } = await responseByPathname(
      './test/mocks/image-too-big-with-valid-images.json',
    );
    expect(errors.length).toBe(1);
    expect(errors[0].errorMessage).toContain('Image is bigger than 1MB');
    expect(result.length).toBe(4);
    result.forEach((url) => expect(url).toBeDefined());
  });

  it('should return error for invalid url', async () => {
    const { errors } = await responseByPathname(
      './test/mocks/invalid-url.json',
    );
    expect(errors.length).toBe(1);
    expect(errors[0].errorMessage).toContain('Invalid URL');
  });

  it('should return error for a url that is not image', async () => {
    const { errors } = await responseByPathname(
      './test/mocks/invalid-image.json',
    );
    expect(errors.length).toBe(1);
    expect(errors[0].errorMessage).toContain('Invalid image');
  });

  it('should save images', async () => {
    const { result, errors } = await responseByPathname('./images.json');
    expect(result).toBeDefined();
    expect(result.length).toBe(4);
    result.forEach((url) => expect(url).toBeDefined());
    expect(errors.length).toBe(0);
  });
});
