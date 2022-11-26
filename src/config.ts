import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();
const env = `${(process.env.NODE_ENV || 'development').toLowerCase()}`;
ConfigModule.forRoot({
  envFilePath: join(process.cwd(), `.env.${env}`),
  isGlobal: true,
});

export const globalConfig = process.env;
