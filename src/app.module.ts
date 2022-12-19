import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import * as dotenv from 'dotenv';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './validation.pipe';
import { CountriesModule } from './countries/countries.module';
import { ProvincesModule } from './provinces/provinces.module';
import { CitiesModule } from './cities/cities.module';
import { SubdistrictsModule } from './subdistricts/subdistricts.module';
import { FilesModule } from './files/files.module';
import {SpacesModule} from './spacesmodule/spaces.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
// import { TestResModule } from './test-res/test-res.module';
import { LeadsModule } from './leads/leads.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PropertyLikeModule } from './property-like/property-like.module';
import { PropertyMiddleware } from './properties/property.middleware';
import { PackagesModule } from './packages/packages.module';
// import { PaymentModule } from './payment/payment.module';
import { SyncModule } from './sync/sync.module';
import { UserPackagesModule } from './user-packages/user-packages.module';
import { GlobalConfigModule } from './global-config/global-config.module';
// import { GlobalConfigModule } from './global-config/global-config.module';
import { MailModule } from './mail/mail.module';
import { User } from './users/entities/user.entity';
import { AdminModule } from '@adminjs/nestjs'

import AdminJS from 'adminjs';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import { File } from './files/entities/file.entity';
import { Country } from './countries/entities/country.entity';
import { Province } from './provinces/entities/province.entity';
import { City } from './cities/entities/city.entity';
import { Subdistrict } from './subdistricts/entities/subdistrict.entity';
import { Package } from './packages/entities/package.entity';
import { UserPackage } from './user-packages/entities/user-package.entity';
import { Property } from './properties/entities/property.entity';
import { UserPackages } from './user-packages/entities/user-packages.entity';
import { PackageFeature } from './packages/entities/package-feature.entity';
import { MailDb } from './mail/entity/mail.entity';
import { PackageFeatures } from './packages/entities/package-features.entity';
import { DistrictModule } from './district/district.module';

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
});

// adminJS.watch();

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}



dotenv.config();

const env = `${(process.env.NODE_ENV || 'development').toLowerCase()}`;

// console.log(process.env)

@Module({
  imports: [
    AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [User, File, Country, Province, City, Subdistrict, Package, UserPackages, Property, PackageFeature, MailDb, PackageFeatures],
        },
        auth: {
          authenticate,
          cookieName: 'adminjs',
          cookiePassword: 'secret'
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret'
        },
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), `.env.${env}`),
      isGlobal: true,
    }),
    // ConfigModule.forFeature(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    // Add your database connection here
    // This example uses TypeORM with a postgres database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        schema: 'public',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: env === 'development' ? true : false,
        ssl: env === 'production' ? { rejectUnauthorized: false } : false,
      }),
    }),
    UsersModule,
    AuthModule,
    PropertiesModule,
    CountriesModule,
    ProvincesModule,
    CitiesModule,
    SubdistrictsModule,
    FilesModule,
    SpacesModule,
    LeadsModule,
    PropertyLikeModule,
    PackagesModule,
    SyncModule,
    UserPackagesModule,
    GlobalConfigModule,
    MailModule,
    DistrictModule
  ],
  controllers: [AppController],
  providers: [AppService,  {
    provide: APP_PIPE,
    useClass: ValidationPipe,
  },],
})


export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PropertyMiddleware)
      .forRoutes('graphql');
  }
}
