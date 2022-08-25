import * as AWS from 'aws-sdk';
import { Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const env = `${(process.env.NODE_ENV || 'development').toLowerCase()}`;
ConfigModule.forRoot({
  envFilePath: join(process.cwd(), `.env.${env}`),
  isGlobal: true,
})

// Unique identifier of the service in the dependency injection layer
export const DoSpacesServiceLib = 'lib:do-spaces-service';

// Creation of the value that the provider will always be returning.
// An actual AWS.S3 instance
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);

const S3 = new AWS.S3({
  endpoint: spacesEndpoint.href,
  credentials: new AWS.Credentials({
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  }),
});
// Now comes the provider
export const DoSpacesServicerovider: Provider<AWS.S3> = {
  provide: DoSpacesServiceLib,
  useValue: S3,
};

// This is just a simple interface that represents an uploaded file object 
export interface UploadedMulterFileI {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export const configSpaces = {
  path: env === 'development' ? 'dev' : '',
  bucket: process.env.SPACES_BUCKET,
  endpoint: process.env.SPACES_ENDPOINT
}