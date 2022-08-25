import { Module } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { ProvincesResolver } from './provinces.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { CountriesModule } from 'src/countries/countries.module';

@Module({
  imports: [TypeOrmModule.forFeature([Province ]), CountriesModule],
  providers: [ProvincesResolver, ProvincesService],
  exports: [ProvincesService]
})
export class ProvincesModule {}
