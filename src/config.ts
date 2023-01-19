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
    logo: "",
    contact: {
      email: ["halomin@halorumah.id"],
      mobile: [{
        name: "Halorumah Customer Service",
        number: "6281290518080",
        whatsapp: "https://wa.me/6281290518080"
      }]
    }
  },
  appmode: process.env.NODE_ENV || 'development',
  app_version: "",
  app_forceupdate: true,
  maintenance_mode: false,
  disable_membership: false,
  endpoint: {
    payment: "https://api-halorumah.renaldimedia.digital"
  },
  tracker_code_header_name: "hlrm-tracker",
  tracker_email_header_name: "hlrm-tracker-email",
  disable_tracker: false
};

export const globalConfig = process.env;
