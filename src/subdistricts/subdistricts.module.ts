import { Module } from '@nestjs/common';
import { SubdistrictsService } from './subdistricts.service';
import { SubdistrictsResolver } from './subdistricts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subdistrict } from './entities/subdistrict.entity';
import { CitiesModule } from 'src/cities/cities.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subdistrict]), CitiesModule],
  providers: [SubdistrictsResolver, SubdistrictsService],
  exports: [SubdistrictsService]
})
export class SubdistrictsModule {}
