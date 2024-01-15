import { createWriteStream, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import axios from 'axios';
import * as stream from 'stream';
import { promisify } from 'util';

const finished = promisify(stream.finished);

interface IImageDataSuccess {
  stream: stream.Readable;
  folderName: string;
  fileName: string;
}

interface IImageDataError {
  errorMessage: string;
}

export default class ImageHandler {
  constructor(private jsonFilePath: string) {}

  getJsonParsed() {
    const jsonRaw = readFileSync(this.jsonFilePath);
    return JSON.parse(jsonRaw.toString());
  }

  saveImage(stream: stream.Readable, path: string): Promise<string> {
    const writer = createWriteStream(path);
    return new Promise((resolve, reject) => {
      stream.pipe(writer);
      writer.on('finish', () => resolve(path));
      writer.on('error', (error: any) =>
        reject(`Error saving image (${path}): ${error}`),
      );
      return finished(writer);
    });
  }

  createFolder(folderName: string) {
    const folderPath = join(process.cwd(), folderName.toString());
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath);
    }
  }

  async getImageData(
    imageUrl: string,
  ): Promise<IImageDataSuccess | IImageDataError> {
    try {
      const { href, pathname } = new URL(imageUrl);
      const pathSplit = pathname.split('/');
      const folderName = pathSplit[pathSplit.length - 2];
      const fileName = pathSplit[pathSplit.length - 1]?.split('?')[0];

      if (!folderName || !fileName) {
        throw new Error('Invalid image');
      }

      const { data, headers } = await axios({
        method: 'get',
        url: href,
        responseType: 'stream',
      });

      if (+headers['content-length'] > 1048576) {
        const errorMessage = `Image is bigger than 1MB: ${imageUrl}`;
        if (process.env.NODE_ENV !== 'test') console.log(errorMessage);
        return { errorMessage };
      }

      return {
        stream: data,
        folderName,
        fileName,
      };
    } catch (error) {
      return { errorMessage: (error as any).message };
    }
  }

  async handle() {
    const { images } = this.getJsonParsed();

    const valid: IImageDataSuccess[] = [];
    const invalid: IImageDataError[] = [];

    /**
     * Pushes all the valid images metadata to create to `valid` array.
     * Pushes all the invalid images messages to `invalid` array.
     * Create the folders if it doesn't exist with the domain's name
     * 
     * Obs: The reason of all this rules beeing inside this loop,
     * is to prevent unecessery loops for each rule.
     */

    await Promise.all(
      images.map(async (url: string) => {
        const imageData: any = await this.getImageData(url);
        if (imageData.errorMessage)
          return invalid.push(imageData as IImageDataError);
        valid.push(imageData as IImageDataSuccess);
        return this.createFolder(imageData.folderName);
      }),
    );

    // Save the valid images and return the it paths
    const result = await Promise.all(
      valid.map(({ stream, folderName, fileName }) =>
        this.saveImage(stream, join(process.cwd(), folderName, fileName)),
      ),
    );

    return {
      result,
      errors: invalid,
    };
  }
}
