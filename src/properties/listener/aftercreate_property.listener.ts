import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';
import { CitiesService } from 'src/cities/cities.service';
import { CountriesService } from 'src/countries/countries.service';
import { ProvincesService } from 'src/provinces/provinces.service';
import { SubdistrictsService } from 'src/subdistricts/subdistricts.service';
import { DataSource } from 'typeorm';
import { Property } from '../entities/property.entity';
import { PropertyCreatedEvent } from '../events/aftercreate_property.event';
import { PropertiesService } from '../properties.service';

@Injectable()
export class PropertyCreatedListener {
  constructor(
    private propService: PropertiesService,
    private readonly countriesServices: CountriesService,
    private readonly provinceServices: ProvincesService,
    private readonly citiesServices: CitiesService,
    private readonly subdistrictsServices: SubdistrictsService,
    @InjectDataSource() private readonly datasource: DataSource
  ){}
  @OnEvent('property.created')
  async updateSearchKey(event: PropertyCreatedEvent) {
    // handle and process "OrderCreatedEvent" event
    console.log('property created')
    let loc = "";
    if(event.property.subdistrict != null){
      loc = await this.subdistrictsServices.findAllOne(event.property.subdistrict);
    }
    if(event.property.subdistrict == null && event.property.city){
      loc = await this.subdistrictsServices.findAllOne(event.property.subdistrict);
    }
    // const loc = await this.provinceServices.findOne(event.property.province_id);
    let keyText = event.property.property_title + " " + event.property.property_desc + " ";
    Object.entries(loc[0]).forEach(([key, val]) => {
      switch (key) {
        case 'subdistrict_name':
          keyText += "kecamatan " + val + " ";
          break;
          case 'city_name':
            keyText += "kota:" + val + " ";
            keyText += "kabupaten " + val + " ";
            break;
            case 'province_name':
              keyText += "provinsi " + val + " ";
              break;
        default:
          break;
      }
    })
    const result = await this.datasource.getRepository(Property).createQueryBuilder('prop').update(Property).set({search_key: `${keyText}`}).where({id: event.property.id}).execute();
    console.log(result);
  }
}