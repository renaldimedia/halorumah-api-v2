import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesResolver } from './countries.resolver';
import { Country } from './entities/country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from 'src/provinces/entities/province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Province])],
  providers: [CountriesResolver, CountriesService],
  exports: [CountriesService]
})
export class CountriesModule {}
