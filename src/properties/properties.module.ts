import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesResolver } from './properties.resolver';
import { Property } from './entities/property.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from 'src/countries/countries.module';
import { SpacesModule } from 'src/spacesmodule/spaces.module';
import { ProvincesModule } from 'src/provinces/provinces.module';
import { CitiesModule } from 'src/cities/cities.module';
import { SubdistrictsModule } from 'src/subdistricts/subdistricts.module';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { PropertyCreatedListener } from './listener/aftercreate_property.listener';
import { PropertyMeta } from './entities/property-meta.entity';
import { PropertyMetaMaster } from './entities/property-meta-master.entity';
import { PropertyListImages } from './entities/property-list-images.entity';
import { PropertiesController } from './properties.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Property, PropertyMeta, PropertyMetaMaster, PropertyListImages]), CountriesModule, SpacesModule, ProvincesModule, CitiesModule, SubdistrictsModule, FilesModule, UsersModule],
  providers: [PropertiesResolver, PropertiesService, PropertyCreatedListener],
  controllers: [PropertiesController],
})
export class PropertiesModule {}
