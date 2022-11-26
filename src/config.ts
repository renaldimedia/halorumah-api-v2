import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();
const env = `${(process.env.NODE_ENV || 'development').toLowerCase()}`;
ConfigModule.forRoot({
  envFilePath: join(process.cwd(), `.env.${env}`),
  isGlobal: true,
});

export const cfg = {
  propertyType: [
    {
      property_type: "Rumah",
      display_name: "Rumah",
      icon: ""
    },
    {
      property_type: "Apartemen",
      display_name: "Apartemen",
      icon: ""
    },
    {
      property_type: "Tanah",
      display_name: "Tanah",
      icon: ""
    },
    {
      property_type: "Ruko",
      display_name: "Ruko",
      icon: ""
    }
  ],
  site: {
    name: "Halorumah",
    url: "https://halorumah.id",
    logo: "" 
  },
  appmode: process.env.NODE_ENV || 'development',
  maintenance_mode: false,
  disable_membership: false,
  endpoint: {
    payment: "https://api-halorumah.renaldimedia.digital"
  }
};

export const globalConfig = process.env;
