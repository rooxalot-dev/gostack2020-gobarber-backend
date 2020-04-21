import { resolve } from 'path';
import crypto from 'crypto';
import { diskStorage } from 'multer';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

const uploadOptions = {
  tempDirectory: tmpFolder,

  storage: diskStorage({
    destination: tmpFolder,
    filename: (request, filename, cb) => {
      const hash = crypto.randomBytes(10).toString('HEX');
      const newFilename = `${hash}-${filename.originalname}`;

      return cb(null, newFilename);
    },
  }),
};

export default uploadOptions;
