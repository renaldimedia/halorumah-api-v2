import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { DataSource, Repository } from 'typeorm';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';
import { PropertyMetaMaster, PropertyMetaMasterInput } from './entities/property-meta-master.entity';
import { PropertyMeta } from './entities/property-meta.entity';
import { Property } from './entities/property.entity';
import { FilesService } from 'src/files/files.service';
import { PropertyListImages } from './entities/property-list-images.entity';
import { SubdistrictsService } from 'src/subdistricts/subdistricts.service';
import { CountriesService } from 'src/countries/countries.service';
import { ProvincesService } from 'src/provinces/provinces.service';
import { CitiesService } from 'src/cities/cities.service';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { PropertyResponse } from './entities/get-all-props.response';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class PropertiesService {
  constructor(@InjectRepository(Property) private readonly repos: Repository<Property>, @InjectRepository(PropertyMeta) private readonly metasRepos: Repository<PropertyMeta>, @InjectRepository(PropertyMetaMaster) private readonly metaMasterRepos: Repository<PropertyMetaMaster>, @InjectDataSource() private datasource: DataSource, private readonly fileService: FilesService, @InjectRepository(PropertyListImages) private readonly listImagesRepos: Repository<PropertyListImages>, private readonly subdistrictsService: SubdistrictsService, private readonly countryService: CountriesService, private readonly provincesService: ProvincesService, private readonly citiesService: CitiesService, private readonly httpService: HttpService) { }

  async createMeta(input: PropertyMetaMasterInput) {
    const pr = this.metaMasterRepos.create(input);
    const res = await this.metaMasterRepos.insert(pr);

    return { ...input };
  }

  async create(createPropertyInput: CreatePropertyInput, userid: string = null) {
    // const prop = new Property();
    // const metas = new PropertyMeta();
    const { property, metas, callback } = createPropertyInput;
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

  async findAllMeta(propId: number): Promise<PropertyMeta[]> {
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
            query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
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
        let lt = "";
        if (e.property_type != null) {
          lt += " " + e.property_type
        }
        if (e.sales_type != null) {
          lt += " " + e.sales_type
        }
        e['property_type_rendered'] = lt.trim();
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
        if (e.subdistrict != null) {
          addr += " " + e.subdistrict['subdistrict_name'];
        }
        if (e.city != null) {
          addr += " " + e.city['city_name'];
        }
        if (e.province != null) {
          addr += " " + e.province['province_name']
        }
        if (e.country != null) {
          addr += " " + e.country['country_name']
        }
        e['full_address_rendered'] = addr.trim();
        if (e.property_featured_image != null) {
          e['property_featured_image_url'] = e.property_featured_image['rendered_url'];
        }
        // if (e.call_to_user.photo_profile != null && typeof e.call_to_user.photo_profile == 'string') {
        //   e.call_to_user.photo_profile = await this.fileService.findOne(e.call_to_user.photo_profile);
        // }
        // if(e.call_to_user.province != null && typeof e.call_to_user.province == 'number'){
        //   e.call_to_user.province = await this.provincesService.findOne(e.call_to_user.province);
        // }
        // if(e.call_to_user.country != null && typeof e.call_to_user.country == 'number'){
        //   e.call_to_user.country = await this.countryService.findOne(e.call_to_user.country);
        // }
        // if(e.call_to_user.city != null && typeof e.call_to_user.city == 'number'){
        //   e.call_to_user.city = await this.citiesService.findOne(e.call_to_user.city);
        // }
        // if(e.call_to_user.subdistrict != null && typeof e.call_to_user.subdistrict == 'number'){
        //   e.call_to_user.subdistrict = await this.subdistrictsService.findOne(e.call_to_user.subdistrict);
        // }
        result.push(e)
      }
      return result;
    }

    return [];
  }


  async findOne(id: number, fields: string[] = null, restApi: boolean = false): Promise<PropertyResponse> {
    const res = new PropertyResponse();
    const fnd = await this.repos.findOne({
      where: { id: id },
      relations: [
        'province', 'country', 'city', 'subdistrict', 'call_to_user'
      ]
    });

    Object.entries(fnd).forEach(([key, val]) => {
      res[key] = val;
    });

    console.log(res)

    let lt = "";
    if (res.property_type != null) {
      lt += " " + res.property_type
    }
    if (res.sales_type != null) {
      lt += " " + res.sales_type
    }
    res['property_type_rendered'] = lt.trim();

    if (res.call_to_user['full_address'] == null) {
      res.call_to_user['full_address'] = "";
      if (typeof res.call_to_user['subdistrict'] == 'number') {
        let sub = await this.subdistrictsService.findOne(res.call_to_user['subdistrict']);
        res.call_to_user['full_address'] += " " + sub.subdistrict_name;
      }
      if (typeof res.call_to_user['city'] == 'number') {
        let city = await this.citiesService.findOne(res.call_to_user['city']);
        res.call_to_user['full_address'] += " " + city.city_name;
      }
      if (typeof res.call_to_user['province'] == 'number') {
        let prov = await this.provincesService.findOne(res.call_to_user['province']);
        res.call_to_user['full_address'] += " " + prov.province_name;
      }
      if (typeof res.call_to_user['country'] == 'number') {
        let sub = await this.countryService.findOne(res.call_to_user['country']);
        res.call_to_user['full_address'] += " " + (typeof sub.country_name != 'undefined' ? sub.country_name : "")
      }
      res.call_to_user['full_address'] = res.call_to_user['full_address'].trim();
    }

    var formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    if (res.property_price != null) {
      res['property_price_rendered'] = formatter.format(res.property_price);
    }
    if (res.property_price_second != null) {
      res['property_price_second_rendered'] = formatter.format(res.property_price_second);
    }
    if (res.property_area_size != null) {
      res['property_area_size_rendered'] = res.property_area_size + "m<sup>2</sup>";
    }
    if (res.property_building_size != null) {
      res['property_building_size_rendered'] = res.property_building_size + "m<sup>2</sup>";
    }

    if (res.property_list_images != null && res.property_list_images.length > 0) {
      const images = await this.fileService.findFileList(res.property_list_images);

      res['property_list_images_url'] = images;
    } else {
      res['property_list_images_url'] = [];
    }
    const metas = await this.findAllMeta(res.id);
    res['features_extra'] = metas;
    res['property_has_airconditioner_rendered'] = res.property_has_airconditioner ? "Tersedia" : "Tidak Tersedia";
    res['property_has_garage_rendered'] = res.property_has_garage ? "Tersedia" : "Tidak Tersedia";
    res['property_has_heater_rendered'] = res.property_has_heater ? "Tersedia" : "Tidak Tersedia";
    let wanum = res.call_to_user.account_whatsapp_number != null ? res.call_to_user.account_whatsapp_number : res.call_to_user.phone;
    res.call_to_user['whatsapp_link'] = `https://wa.me/${wanum}`;

    // console.log(res.call_to_user.province)
    if (res.property_featured_image != null && typeof res.property_featured_image == 'string') {
      res.property_featured_image = await this.fileService.findOne(res.property_featured_image);
    }
    if (res.call_to_user.photo_profile != null && typeof res.call_to_user.photo_profile == 'string') {
      res.call_to_user.photo_profile = await this.fileService.findOne(res.call_to_user.photo_profile);
    }
    if(res.call_to_user.province != null && typeof res.call_to_user.province == 'number'){
      res.call_to_user.province = await this.provincesService.findOne(res.call_to_user.province);
    }
    if(res.call_to_user.country != null && typeof res.call_to_user.country == 'number'){
      res.call_to_user.country = await this.countryService.findOne(res.call_to_user.country);
    }
    if(res.call_to_user.city != null && typeof res.call_to_user.city == 'number'){
      res.call_to_user.city = await this.citiesService.findOne(res.call_to_user.city);
    }
    if(res.call_to_user.subdistrict != null && typeof res.call_to_user.subdistrict == 'number'){
      res.call_to_user.subdistrict = await this.subdistrictsService.findOne(res.call_to_user.subdistrict);
    }

    return res;
  }

  // async findOne(id: number, fields: string[] = null, restApi: boolean = false): Promise<any> {
  //   const query = this.repos.createQueryBuilder('prop').addSelect("prop.id", "prop_id").where({ id: id });
  //   let select = [];

  //   if (fields != null && fields.length > 0 && !restApi) {
  //     fields.forEach(val => {
  //       switch (val) {
  //         case 'features_extra':
  //           break;
  //         case 'property_featured_image':
  //           query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
  //           break;
  //         case 'property_featured_image_url':
  //           // query.leftJoinAndSelect(`prop.${val}`, `prop_property_featured_image`).addSelect([`prop_${val}.id`]);
  //           break;
  //         case 'country':
  //           query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
  //           break;
  //         case 'province':
  //           query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
  //           break;
  //         case 'city':
  //           query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
  //           break;
  //         case 'subdistrict':
  //           query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
  //           break;
  //         case 'call_to_user':
  //           // query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`*`, `CONCAT('https://wa.me/', prop_${val}.account_whatsapp_number) as whatsapp_link`]);
  //           break;
  //         case 'property_price_rendered':
  //           break;
  //         case 'full_address_rendered':
  //           break;
  //         case 'property_building_size_rendered':
  //           break;
  //         case 'property_area_size_rendered':
  //           break;
  //         case 'property_type_rendered':
  //           break;
  //         case 'property_has_airconditioner_rendered':
  //           break;
  //         case 'property_has_heater_rendered':
  //           break;
  //         case 'property_has_garage_rendered':
  //           break;
  //         case 'id':
  //           break;
  //         case 'metas':
  //           break;
  //         case 'property_type_rendered':
  //           break;
  //         case 'metas_field':
  //           break;
  //         case 'property_list_images_url':
  //           select.push(`prop.property_list_images`);
  //           break;
  //         default:
  //           select.push(`prop.${val}`);
  //           break;
  //       }
  //     });

  //     if (select.length > 0) {
  //       query.addSelect(select);
  //     }
  //   } else if (restApi) {
  //     query.addSelect(['prop.*']);
  //     query.leftJoinAndSelect(`prop.property_featured_image`, `prop_property_featured_image`).addSelect([`prop_property_featured_image.*`]);
  //     query.leftJoinAndSelect(`prop.country`, `prop_country`).addSelect([`prop_country.*`]);
  //     query.leftJoinAndSelect(`prop.province`, `prop_province`).addSelect([`prop_province.*`]);
  //     query.leftJoinAndSelect(`prop.city`, `prop_city`).addSelect([`prop_city.*`]);
  //     query.leftJoinAndSelect(`prop.subdistrict`, `prop_subdistrict`).addSelect([`prop_subdistrict.*`]);
  //     query.leftJoinAndSelect(`prop.call_to_user`, `prop_call_to_user`).addSelect([`prop_call_to_user.*`]);
  //   }
  //   const res = await query.getOneOrFail();
  //   // console.log(res);
  //   var formatter = new Intl.NumberFormat('id-ID', {
  //     style: 'currency',
  //     currency: 'IDR',
  //     maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  //   });
  //   if (res != null) {
  //     let lt = "";
  //     if(res.property_type != null){
  //       lt += " " + res.property_type
  //     }
  //     if(res.sales_type != null){
  //       lt += " " + res.sales_type
  //     }
  //     res['property_type_rendered'] = lt.trim();
  //     if(res.call_to_user['account_whatsapp_number'] != null){
  //       res.call_to_user
  //     }
  //     // if (res.call_to_user['full_address'] == null) {
  //     //   res.call_to_user['full_address'] = "";
  //     //   if (typeof res.call_to_user['subdistrict'] == 'number') {
  //     //     let sub = await this.subdistrictsService.findOne(res.call_to_user['subdistrict']);
  //     //     res.call_to_user['full_address'] += " " + sub.subdistrict_name;
  //     //   }
  //     //   if (typeof res.call_to_user['city'] == 'number') {
  //     //     let city = await this.citiesService.findOne(res.call_to_user['city']);
  //     //     res.call_to_user['full_address'] += " " + city.city_name;
  //     //   }
  //     //   if (typeof res.call_to_user['province'] == 'number') {
  //     //     let prov = await this.provincesService.findOne(res.call_to_user['province']);
  //     //     res.call_to_user['full_address'] += " " + prov.province_name;
  //     //   }
  //     //   if (typeof res.call_to_user['country'] == 'number') {
  //     //     let sub = await this.countryService.findOne(res.call_to_user['country']);
  //     //     res.call_to_user['full_address'] += " " + (typeof sub.country_name != 'undefined' ? sub.country_name : "")
  //     //   }
  //     //   res.call_to_user['full_address'] = res.call_to_user['full_address'].trim();
  //     // }

  //     if (res.property_price != null) {
  //       res['property_price_rendered'] = formatter.format(res.property_price);
  //     }
  //     if (res.property_price_second != null) {
  //       res['property_price_second_rendered'] = formatter.format(res.property_price_second);
  //     }
  //     if (res.property_area_size != null) {
  //       res['property_area_size_rendered'] = res.property_area_size + "m<sup>2</sup>";
  //     }
  //     if (res.property_building_size != null) {
  //       res['property_building_size_rendered'] = res.property_building_size + "m<sup>2</sup>";
  //     }

  //     let addr = "";
  //     if (res.property_full_address != null) {
  //       addr += res.property_full_address + " ";
  //     }
  //     if (res.subdistrict != null) {
  //       addr += typeof res.subdistrict['subdistrict_name'] != 'undefined' ? res.subdistrict['subdistrict_name'] + " " : ""
  //     }
  //     if (res.city != null) {
  //       addr += typeof res.city['city_name'] != 'undefined' ? res.city['city_name'] + " " : ""
  //     }
  //     if (res.province != null) {
  //       addr += typeof res.province['province_name'] != 'undefined' ? res.province['province_name'] + " " : ""
  //     }
  //     if (res.country != null) {
  //       addr += typeof res.country['country_name'] != 'undefined' ? res.country['country_name'] + " " : ""
  //     }
  //     // console.log(addr)
  //     res['full_address_rendered'] = "";
  //     res['full_address_rendered'] = addr.trim();
  //     if (res.property_price != null) {
  //       res['property_price_rendered'] = formatter.format(res.property_price);
  //     }
  //     if (res['property_featured_image'] != null) {
  //       res['property_featured_image_url'] = res.property_featured_image['rendered_url']
  //     }
  //     res['property_type_rendered'] = "";
  //     if (res.property_type != null) {
  //       res['property_type_rendered'] += res.property_type;
  //     }
  //     if (res.sales_type != null) {
  //       res['property_type_rendered'] += (" " + res.sales_type);
  //     }
  //     if (res.property_list_images != null && res.property_list_images.length > 0) {
  //       const images = await this.fileService.findFileList(res.property_list_images);

  //       res['property_list_images_url'] = images;
  //     } else {
  //       res['property_list_images_url'] = [];
  //     }
  //     const metas = await this.findAllMeta(res.id);
  //     res['features_extra'] = metas;
  //     res['property_has_airconditioner_rendered'] = res.property_has_airconditioner ? "Tersedia" : "Tidak Tersedia";
  //     res['property_has_garage_rendered'] = res.property_has_garage ? "Tersedia" : "Tidak Tersedia";
  //     res['property_has_heater_rendered'] = res.property_has_heater ? "Tersedia" : "Tidak Tersedia";
  //     return res;
  //   }

  //   return null;
  //   // return res;
  // }

  async updateUserOld(old_userid: number, prop_id: number){

  }

  async getExtraFeatureList(): Promise<PropertyMetaMaster[]> {
    const result = await this.metaMasterRepos.createQueryBuilder('meta').where(`property_constant ILike '%FEATURE%'`).getMany();
    // console.log(result)
    return result;
  }

  async update(id: number, updatePropertyInput: UpdatePropertyInput) {

    const { property, metas } = updatePropertyInput;

    const result = await this.repos.update({ id: id }, property);
    const ret = new GlobalMutationResponse();
    if (result.affected > 0) {

      ret.affected = result.affected;
      ret.message = "Berhasil mengupdate properti";
      ret.errors = [];

      return ret;
    }
    ret.affected = 0;
    ret.message = "Gagal mengupdate properti";
    ret.errors = [];

    return ret;
  }

  async remove(id: number) {
    const res = await this.repos.delete({ id: id });
    const ret = new GlobalMutationResponse();
    if (typeof res.affected == 'undefined') {
      ret.affected = 0;
      ret.message = "Gagal menghapus properti";
      ret.errors = [];

      return ret;
    }

    ret.affected = res.affected;
    ret.message = "Berhasil menghapus properti";
    ret.errors = [];

    return ret;
  }
}
