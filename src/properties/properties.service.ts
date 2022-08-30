import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { DataSource, ILike, Like, Repository } from 'typeorm';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';
import { PropertyMetaMaster, PropertyMetaMasterInput } from './entities/property-meta-master.entity';
import { PropertyMeta } from './entities/property-meta.entity';
import { Property } from './entities/property.entity';
import { PropertyMetaResponse } from './entities/property-meta.entity';
import { PropertyResponse } from './entities/get-all-props.response';
import { FilesService } from 'src/files/files.service';
import { PropertyListImages } from './entities/property-list-images.entity';
import { SubdistrictsService } from 'src/subdistricts/subdistricts.service';
import { CountriesService } from 'src/countries/countries.service';
import { ProvincesService } from 'src/provinces/provinces.service';
import { CitiesService } from 'src/cities/cities.service';

@Injectable()
export class PropertiesService {
  constructor(@InjectRepository(Property) private readonly repos: Repository<Property>, @InjectRepository(PropertyMeta) private readonly metasRepos: Repository<PropertyMeta>, @InjectRepository(PropertyMetaMaster) private readonly metaMasterRepos: Repository<PropertyMetaMaster>, @InjectDataSource() private datasource: DataSource, private readonly fileService: FilesService, @InjectRepository(PropertyListImages) private readonly listImagesRepos: Repository<PropertyListImages>, private readonly subdistrictsService: SubdistrictsService, private readonly countryService: CountriesService, private readonly provincesService: ProvincesService, private readonly citiesService: CitiesService) { }

  async createMeta(input: PropertyMetaMasterInput) {
    const pr = this.metaMasterRepos.create(input);
    const res = await this.metaMasterRepos.insert(pr);

    return { ...input };
  }

  async create(createPropertyInput: CreatePropertyInput, userid: string = null) {
    // const prop = new Property();
    // const metas = new PropertyMeta();
    const { property, metas } = createPropertyInput;
    if (typeof property.created_by_user == 'undefined') {
      property['created_by_user'] = userid
    }
    if (typeof property.call_to_user == 'undefined') {
      property['call_to_user'] = userid
    }
    const pr = this.repos.create(property);
    const propSaved = await this.repos.insert(pr);

    if (typeof property.property_list_images != 'undefined' && propSaved.identifiers.length > 0) {
      let ls = [];
      property.property_list_images.forEach(val => {
        ls.push({ property: propSaved.identifiers[0].id, file: val });
      })
      await this.listImagesRepos.createQueryBuilder().insert().values(ls).execute();
    }

    if (typeof metas != 'undefined' && metas.length > 0) {
      let ls = [];
      metas.forEach(val => {
        ls.push({ property: propSaved.identifiers[0].id, ...val });
      })
      await this.metasRepos.createQueryBuilder().insert().values(ls).execute();
    }

    return { ...property };
  }

  async findAllMeta(propId: number): Promise<PropertyMetaResponse[]> {
    const res = await this.metasRepos.findBy({ property: propId });
    // console.log(res)
    return res;
  }

  async findAll(option: MetaQuery = null, fields: string[] = null): Promise<any> {
    const query = this.repos.createQueryBuilder('prop').select("prop.id", "prop_id");
    let select = [];

    if (fields != null && fields.length > 0) {
      fields.forEach(val => {
        switch (val) {
          case 'property_featured_image':
            query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'property_featured_image_url':
            // query.leftJoinAndSelect(`prop.${val}`, `prop_property_featured_image`).addSelect([`prop_${val}.id`]);
            break;
          case 'country':
            query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'province':
            query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'city':
            query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'subdistrict':
            query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'call_to_user':
            query.leftJoinAndSelect(`prop.${val}`, `user`).addSelect([`*`]);
            break;
          case 'property_price_rendered':
            break;
          case 'full_address_rendered':
            break;
          case 'property_building_size_rendered':
            break;
          case 'property_area_size_rendered':
            break;
          case 'property_type_rendered':
            break;
          case 'id':
            break;
          case 'metas':
            break;
          case 'metas_field':
            break;
          case 'property_list_images_url':
            select.push(`prop.property_list_images`);
            break;
          default:
            select.push(`prop.${val}`);
            break;
        }
      });

      if (select.length > 0) {
        query.addSelect(select);
      }
    }
    if (option != null) {
      if (typeof option.take != 'undefined') {
        query.limit(option.take);
      }
      if (typeof option.page != 'undefined') {
        query.offset((option.page - 1) * option.take);
      }

      if (typeof option.where != 'undefined' && option.where.length > 0) {
        for (let index = 0; index < option.where.length; index++) {
          // const element = array[index];
          // console.log(index + "+");
          // console.log(option.where[index].operator);
          let obj = {};
          let tbl = "prop";
          if (typeof option.where[index].table != 'undefined') {
            tbl = option.where[index].table;
          }
          if (option.where[index].operator == 'LIKE') {
            obj[option.where[index].key] = `ILike '%${option.where[index].value}%'`;
          } else {
            obj[option.where[index].key] = `= '${option.where[index].value}'`;
          }

          if (index == 0) {
            query.where(`${tbl}.${option.where[index].key} ${obj[option.where[index].key]}`);
          } else if (index > 0) {
            if (option.where[index].nextOperator == 'OR') {
              query.orWhere(`${tbl}.${option.where[index].key} ${obj[option.where[index].key]}`);
            } else {
              query.andWhere(`${tbl}.${option.where[index].key} ${obj[option.where[index].key]}`);
            }
          }
        }
      }

      if (typeof option.sortBy != 'undefined' && option.sortBy.length > 0) {
        for (let index = 0; index < option.sortBy.length; index++) {
          // const element = array[index];
          query.addOrderBy(`prop.${option.sortBy[index].key}`, option.sortBy[index].isAsc ? "ASC" : "DESC");
        }
      }
    }
    // console.log(query)
    const res = await query.getMany();
    // console.log(res);
    var formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    if (res.length > 0) {
      const result = [];
      for (let i = 0; i < res.length; i++) {
        let e = res[i];
        // res.forEach(e => {
        // console.log(e.id)
        // console.log()
        if (e.property_price != null) {
          e['property_price_rendered'] = formatter.format(e.property_price);
        }
        if (e.property_price_second != null) {
          e['property_price_second_rendered'] = formatter.format(e.property_price_second);
        }
        if (e.property_area_size != null) {
          e['property_area_size_rendered'] = e.property_area_size + "m<sup>2</sup>";
        }
        if (e.property_building_size != null) {
          e['property_building_size_rendered'] = e.property_building_size + "m<sup>2</sup>";
        }

        let addr = "";
        if (e.property_full_address != null) {
          addr += e.property_full_address;
        }
        // console.log(e.subdistrict['subdistrict_name'])
        if (e.subdistrict != null) {
          // let sub = await this.subdistrictsService.findOne(e.subdistrict);
          addr += " " + e.subdistrict['subdistrict_name'];
        }
        if (e.city != null) {
          // let city = await this.citiesService.findOne(e.city);
          addr += " " + e.city['city_name'];
        }
        if (e.province != null) {
          // let prov = await this.provincesService.findOne(e.province);
          addr += " " + e.province['province_name']
        }
        if (e.country != null) {
          // let ct = await this.countryService.findOne(e.country);
          addr += " " + e.country['country_name']
        }
        e['full_address_rendered'] = addr.trim();
        if (e.property_list_images != null && e.property_list_images.length > 0) {
          const images = this.fileService.findFileList(e.property_list_images, true);
          e['property_list_images_url'] = images;
          // result.push(e);
        } else {
          e['property_list_images_url'] = [];
        }
        if (e.property_featured_image != null) {
          e['property_featured_image_url'] = e.property_featured_image['rendered_url'];
        }
        // let mt = this.findAllMeta(e.id);
        const metas = this.findAllMeta(e.id);
        e['metas_field'] = metas;
        result.push(e)
        // });
      }

      // console.log(result)
      return result;
    }

    return [];
  }



  async findOne(id: number, fields: string[] = null, restApi: boolean = false): Promise<any> {
    const query = this.repos.createQueryBuilder('prop').addSelect("prop.id", "prop_id").where({ id: id });
    let select = [];

    if (fields != null && fields.length > 0 && !restApi) {
      fields.forEach(val => {
        switch (val) {
          case 'property_featured_image':
            query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
            break;
          case 'property_featured_image_url':
            // query.leftJoinAndSelect(`prop.${val}`, `prop_property_featured_image`).addSelect([`prop_${val}.id`]);
            break;
          case 'country':
            query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
            break;
          case 'province':
            query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
            break;
          case 'city':
            query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
            break;
          case 'subdistrict':
            query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
            break;
          case 'call_to_user':
            query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`*`]);
            break;
          case 'property_price_rendered':
            break;
          case 'full_address_rendered':
            break;
          case 'property_building_size_rendered':
            break;
          case 'property_area_size_rendered':
            break;
          case 'property_type_rendered':
            break;
          case 'property_type_rendered':
            break;
          case 'id':
            break;
          case 'metas':
            break;
          case 'metas_field':
            break;
          case 'property_list_images_url':
            select.push(`prop.property_list_images`);
            break;
          default:
            select.push(`prop.${val}`);
            break;
        }
      });

      if (select.length > 0) {
        query.addSelect(select);
      }
    } else if (restApi) {
      query.addSelect(['prop.*']);
      query.leftJoinAndSelect(`prop.property_featured_image`, `prop_property_featured_image`).addSelect([`prop_property_featured_image.*`]);
      query.leftJoinAndSelect(`prop.country`, `prop_country`).addSelect([`prop_country.*`]);
      query.leftJoinAndSelect(`prop.province`, `prop_province`).addSelect([`prop_province.*`]);
      query.leftJoinAndSelect(`prop.city`, `prop_city`).addSelect([`prop_city.*`]);
      query.leftJoinAndSelect(`prop.subdistrict`, `prop_subdistrict`).addSelect([`prop_subdistrict.*`]);
      query.leftJoinAndSelect(`prop.call_to_user`, `prop_call_to_user`).addSelect([`prop_call_to_user.*`]);
      // query.leftJoinAndSelect(`prop_call_to_user.province`, 'agent_prov').addSelect([`agent_prov.province_name`]);
    }
    const res = await query.getOneOrFail();
    console.log(res);
    var formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    if (res != null) {
      let e = res;
      // console.log(e.subdistrict);
      // e.call_to_user['']
      if(e.call_to_user['full_address'] == null){
        e.call_to_user['full_address'] = ""; 
      }
      if(typeof e.call_to_user['subdistrict'] == 'number'){
        let sub = await this.subdistrictsService.findOne(e.call_to_user['subdistrict']);
        e.call_to_user['full_address'] += " " + sub.subdistrict_name;
      }
      if(typeof e.call_to_user['city'] == 'number'){
        let city = await this.citiesService.findOne(e.call_to_user['city']);
        e.call_to_user['full_address'] += " " + city.city_name;
      }
      if(typeof e.call_to_user['province'] == 'number'){
        let prov = await this.provincesService.findOne(e.call_to_user['province']);
        e.call_to_user['full_address'] += " " + prov.province_name;
      }
      if(typeof e.call_to_user['country'] == 'number'){
        let sub = await this.countryService.findOne(e.call_to_user['country']);
        e.call_to_user['full_address'] += " " + sub.country_name;
      }
      e.call_to_user['full_address'] = e.call_to_user['full_address'].trim();
      if (e.property_price != null) {
        e['property_price_rendered'] = formatter.format(e.property_price);
      }
      if (e.property_price_second != null) {
        e['property_price_second_rendered'] = formatter.format(e.property_price_second);
      }
      if (e.property_area_size != null) {
        e['property_area_size_rendered'] = e.property_area_size + "m<sup>2</sup>";
      }
      if (e.property_building_size != null) {
        e['property_building_size_rendered'] = e.property_building_size + "m<sup>2</sup>";
      }

      let addr = "";
      if (e.property_full_address != null) {
        addr += e.property_full_address;
      }
      // console.log(e.subdistrict['subdistrict_name'])
      if (e.subdistrict != null) {
        // if(restApi){
        //   let sub = await this.subdistrictsService.findOne(e.subdistrict);
        //   console.log(sub)
        //   addr += " " + sub['subdistrict_name'];
        // }else{
          addr += " " + e.subdistrict['subdistrict_name'];

        // }
        
      }
      if (e.city != null) {
        // if(restApi){
        //   let city = await this.citiesService.findOne(e.city);
        //   addr += " " + city['city_name'];
        // }else{
          addr += " " + e.city['city_name'];
        // }
        
      }
      if (e.province != null) {
        // if(restApi){
        //   let prov = await this.provincesService.findOne(e.province);
        //   addr += " " + prov['province_name']
        // }else{
          addr += " " + e.province['province_name']
        // }
        
      }
      if (e.country != null) {
        // if(restApi){
        //   let ct = await this.countryService.findOne(e.country);
        //   addr += " " + ct['country_name']
        // }else{
          addr += " " + e.country['country_name']
        // }
      }
      e['full_address_rendered'] = addr.trim();
      if (res.property_price != null) {
        res['property_price_rendered'] = formatter.format(res.property_price);
      }
      if (res['property_featured_image'] != null) {
        res['property_featured_image_url'] = res.property_featured_image['rendered_url']
      }
      if (res.property_list_images != null && res.property_list_images.length > 0) {
        const images = await this.fileService.findFileList(res.property_list_images, true);

        res['property_list_images_url'] = images;
      } else {
        res['property_list_images_url'] = [];
      }
      // let mt = this.findAllMeta(e.id);
      const metas = await this.findAllMeta(res.id);
      res['metas_field'] = metas;
      // console.log(res)
      return res;
    }

    return null;
    // return res;
  }

  update(id: number, updatePropertyInput: UpdatePropertyInput) {
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }
}
