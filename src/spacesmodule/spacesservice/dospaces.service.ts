import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { randomUUID } from 'crypto';
import { FilesService } from 'src/files/files.service';

import {
  DoSpacesServiceLib,
  UploadedMulterFileI,
  configSpaces
} from './index';

// Typical nestJs service
@Injectable()
export class DoSpaces {
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3, @Inject(FilesService) private fileService: FilesService) { }

  async uploadFile(file: UploadedMulterFileI, userid: string, extrapath: string = "" , ovname: string = "", optimizerConfig: Object = null) {
    // Precaution to avoid having 2 files with the same name
    const id = randomUUID();
    const fileName = ovname == "" ? `${id}-${file.originalname }` : ovname;
    const { size, mimetype, encoding } = file;
    const bucketPath = `${configSpaces.bucket}/${configSpaces.path}${extrapath}`;
    // console.log(bucketPath)
    // Return a promise that resolves only when the file upload is complete
    return new Promise((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: bucketPath,
          Key: fileName,
          Body: file.buffer,
          ACL: 'public-read',
        },
        (error: AWS.AWSError) => {
          if (!error) {
            // resolve()
            const result = {
              id: id,
              rendered_url: `https://${configSpaces.bucket}.${configSpaces.endpoint}/${configSpaces.path}${extrapath}/${fileName}`,
              uniquekey: fileName,
              mimetype: mimetype,
              size: size,
              filepath: `${configSpaces.path}${configSpaces.path != '' ? '/' : ''}${extrapath}`,
              filename: fileName,
              uploaded_by: userid,
              optimize_config: optimizerConfig
            };
            this.fileService.create(result);
            // console.log(r);
            resolve(result);
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${error.message || 'Something went wrong'}`,
              ),
            );
          }
        },
      );
    });
  }
}