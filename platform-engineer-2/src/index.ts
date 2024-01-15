import main from './main';
import path from 'path';

const jsonFilePath = path.resolve(process.cwd(), 'images.json');

const run = async () => {
  const { result } = await main(jsonFilePath);
  console.log('Image paths: ', result);
};

run();
