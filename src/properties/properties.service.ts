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

@Injectable()
export class PropertiesService {
  constructor(@InjectRepository(Property) private readonly repos: Repository<Property>, @InjectRepository(PropertyMeta) private readonly metasRepos: Repository<PropertyMeta>, @InjectRepository(PropertyMetaMaster) private readonly metaMasterRepos: Repository<PropertyMetaMaster>, @InjectDataSource() private datasource: DataSource, private readonly fileService: FilesService, @InjectRepository(PropertyListImages) private readonly listImagesRepos: Repository<PropertyListImages>) { }

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
          if(typeof option.where[index].table != 'undefined'){
            tbl = option.where[index].table;
          }
          if (option.where[index].operator == 'LIKE') {
            obj[option.where[index].key] = `ILike '%${option.where[index].value}%'`;
          } else {
            obj[option.where[index].key] = `= '${option.where[index].value}'`;
          }

          if (index == 0) {
            query.where(`${tbl}.${option.where[index].key} ${obj[option.where[index].key]}`);
          } else if(index > 0) {
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
    if (res.length > 0) {
      const result = [];
      res.forEach(e => {
        // console.log(e.id)
        // console.log()
        
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
      });
      // console.log(result)
      return result;
    }

    return [];
  }



  async findOne(id: number, fields: string[] = null): Promise<any> {
    const query = this.repos.createQueryBuilder('prop').select("prop.id", "prop_id").where({ id: id });
    let select = [];

    if (fields != null && fields.length > 0) {
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
              query.leftJoinAndSelect(`prop.${val}`, `user`).addSelect([`*`]);
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
    const res = await query.getOneOrFail();
    // console.log(res);
    if (res != null) {
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
