import { join } from 'path';
import fs from 'fs';

import uploadOptions from '@config/upload';
import IStorageProvider from '../IStorageProvider';


export default class LocalStorageProvider implements IStorageProvider {
  async store(file: string): Promise<string> {
    const tmpFile = join(uploadOptions.tempDirectory, file);
    const storageFile = join(uploadOptions.storageDirectory, file);

    await fs.promises.rename(tmpFile, storageFile);

    return storageFile;
  }

  async remove(file: string): Promise<void> {
    const existingFile = join(uploadOptions.storageDirectory, file);
    try {
      const fileStats = await fs.promises.stat(existingFile);
      if (fileStats) {
        await fs.promises.unlink(existingFile);
      }
    } catch (error) {
      const { message } = error;
      if (message.search('no such file or directory') >= 0) {
        const bypass = true;
      }
    }
  }
}
