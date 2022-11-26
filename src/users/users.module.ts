import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { ProvincesModule } from 'src/provinces/provinces.module';
import { CountriesModule } from 'src/countries/countries.module';
import { CitiesModule } from 'src/cities/cities.module';
import { SubdistrictsModule } from 'src/subdistricts/subdistricts.module';
import { FilesModule } from 'src/files/files.module';
import { Company } from './entities/company.entity';
import { UserPackages } from '../user-packages/entities/user-packages.entity';
import { Package } from 'src/packages/entities/package.entity';
import { UserController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { PackagesModule } from 'src/packages/packages.module';
import { PackageFeature } from 'src/packages/entities/package-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Company, UserPackages, Package, PackageFeature]), ProvincesModule,  CountriesModule, CitiesModule, SubdistrictsModule, FilesModule, HttpModule, PackagesModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
  controllers: [UserController]
})
export class UsersModule {}
