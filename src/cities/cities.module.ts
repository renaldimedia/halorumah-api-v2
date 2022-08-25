import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesResolver } from './cities.resolver';
import { City } from './entities/city.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvincesModule } from 'src/provinces/provinces.module';

@Module({
  imports: [TypeOrmModule.forFeature([City]), ProvincesModule],
  providers: [CitiesResolver, CitiesService],
  exports: [CitiesService]
})
export class CitiesModule {}
