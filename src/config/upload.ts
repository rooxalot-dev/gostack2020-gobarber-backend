import { resolve } from 'path';
import crypto from 'crypto';
import { Options, diskStorage } from 'multer';

const uploadOptions: Options = {
  storage: diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp'),
    filename: (request, filename, cb) => {
      const hash = crypto.randomBytes(10).toString('HEX');
      const newFilename = `${hash}-${filename.originalname}`;

      return cb(null, newFilename);
    },
  }),
};

export default uploadOptions;
