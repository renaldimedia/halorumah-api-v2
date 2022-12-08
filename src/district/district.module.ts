import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictResolver } from './district.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { City } from 'src/cities/entities/city.entity';

@Module({
  providers: [DistrictResolver, DistrictService],
  imports: [TypeOrmModule.forFeature([District, City])]
})
export class DistrictModule {}
