import { join } from 'path';
import fs from 'fs';
import { lookup } from 'mime-types';
import aws, { S3 } from 'aws-sdk';

import uploadOptions from '@config/upload';
import IStorageProvider from '../IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
  bucket: string;

  client: S3;

  constructor() {
    this.bucket = process.env.S3_BUCKET || '';
    this.client = new aws.S3();
  }

  async store(file: string): Promise<string> {
    const tmpFile = join(uploadOptions.tempDirectory, file);
    const fileContent = await fs.promises.readFile(tmpFile);
    const contentType = lookup(tmpFile);

    const s3Upload = this.client.upload({
      Bucket: this.bucket,
      Key: file,
      Body: fileContent,
      ContentType: contentType || '',
      ACL: 'public-read-write',
    });

    const sendData = await s3Upload.promise();
    fs.promises.unlink(tmpFile);

    return sendData.Location;
  }

  async remove(file: string): Promise<void> {
    const s3Delete = this.client.deleteObject({
      Bucket: this.bucket,
      Key: file,
    });

    s3Delete.promise();
  }
}
