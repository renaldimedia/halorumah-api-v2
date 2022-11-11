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



dotenv.config();

const env = `${(process.env.NODE_ENV || 'development').toLowerCase()}`;

console.log(process.env)

@Module({
  imports: [
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
    PackagesModule
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
