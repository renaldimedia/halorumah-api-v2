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

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Company]), ProvincesModule,  CountriesModule, CitiesModule, SubdistrictsModule, FilesModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
