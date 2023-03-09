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
import { PropertiesWPService } from './properties-wp.service';
import { User } from 'src/users/entities/user.entity';
import { type } from 'os';
import { City } from 'src/cities/entities/city.entity';
import { Province } from 'src/provinces/entities/province.entity';
import { Country } from 'src/countries/entities/country.entity';
import { District } from 'src/district/entities/district.entity';
var slugify = require('slugify');

@Injectable()
export class PropertiesService {
  constructor(@InjectRepository(Property) private readonly repos: Repository<Property>, @InjectRepository(PropertyMeta) private readonly metasRepos: Repository<PropertyMeta>, @InjectRepository(PropertyMetaMaster) private readonly metaMasterRepos: Repository<PropertyMetaMaster>, @InjectDataSource() private datasource: DataSource, private readonly fileService: FilesService, @InjectRepository(PropertyListImages) private readonly listImagesRepos: Repository<PropertyListImages>, private readonly subdistrictsService: SubdistrictsService, private readonly countryService: CountriesService, private readonly provincesService: ProvincesService, private readonly citiesService: CitiesService, private readonly httpService: HttpService, private readonly wpdbService: PropertiesWPService) { }

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
    let slug = slugify(property.property_title);
    let slugExs = await this.repos.createQueryBuilder("prop").where(`prop.slug ILike '${slug}%'`).getCount();
    if (slugExs > 0) {
      slug = slug + "-" + (slugExs + 1);
    }
    pr.slug = slug;
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
    // const query = this.repos.createQueryBuilder('prop').select("prop.id", "prop_id");
    let query = "";
    // let select = [];

    let selectArr = [];
    let whereArr = [];
    let joinArr = [];
    let orderArr = [];
    let limitArr = [];

    let schema = "api"

    if (fields != null && fields.length > 0) {
      fields.forEach(val => {
        switch (val) {
          case 'property_featured_image':
            joinArr.push(`LEFT JOIN "${schema}"."file" "property_featured_image" ON "prop"."propertyFeaturedImageId" = "property_featured_image"."id"`);
            selectArr.push(`"property_featured_image"."rendered_url" AS "property_featured_image_rendered_url"`)
            // query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'property_featured_image_url':
            // query.leftJoinAndSelect(`prop.${val}`, `prop_property_featured_image`).addSelect([`prop_${val}.id`]);
            break;
          case 'country':
            joinArr.push(`LEFT JOIN "${schema}"."country" "country" ON "prop"."countryId" = "country"."id"`)
            selectArr.push(`"country"."id" AS "country_id"`)
            selectArr.push(`"country"."country_name" AS "country_country_name"`)
            selectArr.push(`"prop"."country_text" AS "prop_country_text"`)
            // query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'province':
            joinArr.push(`LEFT JOIN "${schema}"."province" "province" ON "prop"."provinceId" = "province"."id"`)
            selectArr.push(`"province"."id" AS "p_province_id"`)
            selectArr.push(`"province"."province_name" AS "province_province_name"`)
            selectArr.push(`"prop"."province_text" AS "prop_province_text"`)
            // query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'city':
            joinArr.push(`LEFT JOIN "${schema}"."city" "city" ON "prop"."cityId" = "city"."id"`)
            selectArr.push(`"city"."id" AS "p_city_id"`)
            selectArr.push(`"city"."city_name" AS "city_city_name"`)
            selectArr.push(`"prop"."city_text" AS "prop_city_text"`)
            // query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'subdistrict':
            joinArr.push(`LEFT JOIN "${schema}"."subdistrict" "${val}" ON "prop"."subdistrictId" = "${val}"."id"`)
            selectArr.push(`"${val}"."id" AS "p_${val}_id"`)
            selectArr.push(`"${val}"."subdistrict_name" AS "${val}_${val}_name"`)
            selectArr.push(`"prop"."${val}_text" AS "prop_${val}_text"`)
            // query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'created_by_user':
            joinArr.push(`LEFT JOIN "${schema}"."user" "${val}" ON "prop"."createdByUserId" = "${val}"."id"`)
            selectArr.push(`"${val}"."id" AS "p_${val}_id"`)
            selectArr.push(`"${val}"."full_name" AS "p_${val}_full_name"`)
            // query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
            break;
          case 'call_to_user':
            joinArr.push(`LEFT JOIN "${schema}"."user" "call_to_user" ON "prop"."callToUserId" = "call_to_user"."id"`)
            selectArr.push(`"call_to_user"."id" AS "p_call_to_user_id"`)
            selectArr.push(`"call_to_user"."full_name" AS "p_call_to_user_full_name"`)
            // query.leftJoinAndSelect(`prop.${val}`, `${val}`).addSelect([`${val}.id`]);
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
          default:
            // select.push(`prop.${val}`);
            selectArr.push(`"prop"."${val}" AS "${val}"`)
            break;
        }
      });

      // if (select.length > 0) {
      //   query.addSelect(select);
      // }
    }
    if (option != null) {
      if (typeof option.take != 'undefined') {
        // query.limit(option.take);
        limitArr.push(`LIMIT ${option.take}`)
      }
      if (typeof option.page != 'undefined') {
        // query.offset((option.page - 1) * option.take);
        limitArr.push(`OFFSET ${(option.page - 1) * option.take}`)
      }

      if (typeof option.where != 'undefined' && option.where.length > 0) {
        for (let index = 0; index < option.where.length; index++) {
          let obj = {};
          let wr = "";
          let tbl = "prop";
          if (typeof option.where[index].table != 'undefined') {
            tbl = option.where[index].table;
          }
          if (option.where[index].operator == 'LIKE') {
            // obj[option.where[index].key] = `ILike '%${option.where[index].value}%'`;
            wr = `${option.where[index].key} ILike '%${option.where[index].value}%'`
          } else {
            wr = `${option.where[index].key} = '${option.where[index].value}'`
            // obj[option.where[index].key] = `= '${option.where[index].value}'`;
          }

          if (index == 0) {
            whereArr.push(wr)
            // query.where(`${tbl}.${option.where[index].key} ${obj[option.where[index].key]}`);
          } else if (index > 0) {
            if (option.where[index].nextOperator == 'OR') {
              // query.orWhere(`${tbl}.${option.where[index].key} ${obj[option.where[index].key]}`);
              whereArr.push(`OR ${wr}`)
            } else {
              whereArr.push(`AND ${wr}`)
              // query.andWhere(`${tbl}.${option.where[index].key} ${obj[option.where[index].key]}`);
            }
          }
        }
      }

      if (typeof option.sortBy != 'undefined' && option.sortBy.length > 0) {
        for (let index = 0; index < option.sortBy.length; index++) {
          // const element = array[index];
          orderArr.push(`prop.${option.sortBy[index].key} ${option.sortBy[index].isAsc ? "ASC" : "DESC"}`)
          // query.addOrderBy(`prop.${option.sortBy[index].key}`, option.sortBy[index].isAsc ? "ASC" : "DESC");
        }
      }
    }
      
    let select = selectArr.join(",")
    if(selectArr.length == 0){
      select = "*"
    }
    let joins = joinArr.join("\n")
    let where = whereArr.join(" ")
    let order = orderArr.join(",")
    let limit = limitArr.join(" ")

    query = `SELECT ${select} FROM "${schema}"."property" as prop ${joins} ${where} ${order != "" ? "ORDER BY " + order : ""} ${limit}`

    // console.log(query)
    let res = await this.datasource.query(query)
    console.log(res)
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

        if(typeof e.p_created_by_user_id != 'undefined'){
          let cbu = new User()
          cbu.id = e.p_created_by_user_id;
          cbu.full_name = e.p_created_by_user_full_name;
          e['created_by_user'] = cbu;
        }

        if(typeof e.p_call_to_user_id != 'undefined'){
          let cbu = new User()
          cbu.id = e.p_call_to_user_id;
          cbu.full_name = e.p_call_to_user_full_name;
          e['call_to_user'] = cbu;
        }

        if(typeof e.p_city_id != 'undefined'){
          let ct = new City()
          ct.id = e.p_city_id;
          ct.city_name = e.city_city_name == null ? e.city_text : e.city_city_name;
          ct.search_url = ""
          e.city = ct;
        }

        if(typeof e.p_province_id != 'undefined'){
          let ct = new Province()
          ct.id = e.p_province_id;
          ct.province_name = e.province_province_name == null ? e.prop_province_text : e.province_province_name;
          ct.search_url = "";
          e.province = ct;
        }

        if(typeof e.p_country_id != 'undefined'){
          let ct = new Country()
          ct.id = e.p_country_id;
          ct.country_name = e.country_country_name == null ? e.country_text : e.country_country_name;
          ct.search_url = "";
          e.country = ct;
        }

        if(typeof e.p_district_id != 'undefined'){
          let ct = new District()
          ct.id = e.p_district_id;
          ct.district_name = e.district_district_name == null ? e.district_text : e.district_district_name;
          ct.search_url = "";
          e.district = ct;
        }
       
        result.push(e)
      }
      return result;
    }

    return [];
  }

  async formatOne(fnd: Property, res: PropertyResponse) {

    Object.entries(fnd).forEach(([key, val]) => {
      res[key] = val;
    });


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
    if (res.call_to_user.province != null && typeof res.call_to_user.province == 'number') {
      res.call_to_user.province = await this.provincesService.findOne(res.call_to_user.province);
    }
    if (res.call_to_user.country != null && typeof res.call_to_user.country == 'number') {
      res.call_to_user.country = await this.countryService.findOne(res.call_to_user.country);
    }
    if (res.call_to_user.city != null && typeof res.call_to_user.city == 'number') {
      res.call_to_user.city = await this.citiesService.findOne(res.call_to_user.city);
    }
    if (res.call_to_user.subdistrict != null && typeof res.call_to_user.subdistrict == 'number') {
      res.call_to_user.subdistrict = await this.subdistrictsService.findOne(res.call_to_user.subdistrict);
    }
    if (res.slug != null && res.slug != "") {
      res.web_url = `https://halorumah.id/property/${res.slug}`;
    }


    return res;
  }

  async findOne(id: number, fields: string[] = null, restApi: boolean = false): Promise<PropertyResponse> {
    let res = new PropertyResponse();
    const fnd = await this.repos.findOne({
      where: { id: id },
      relations: [
        'province', 'country', 'city', 'subdistrict', 'call_to_user'
      ]
    });

    res = await this.formatOne(fnd, res);
    return res;
  }

  async findOneSlug(slug: string, fields: string[] = null, restApi: boolean = false): Promise<PropertyResponse> {
    let res = new PropertyResponse();
    const fnd = await this.repos.findOne({
      where: { slug: slug },
      relations: [
        'province', 'country', 'city', 'subdistrict', 'call_to_user'
      ]
    });

    res = await this.formatOne(fnd, res);
    return res;
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
