import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { ILike, Repository } from 'typeorm';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';
import { PropertyMeta } from './entities/property-meta.entity';
import { Property } from './entities/property.entity';
import { PropertyListImages } from './entities/property-list-images.entity';

@Injectable()
export class PropertiesService {
  constructor(@InjectRepository(Property) private readonly repos: Repository<Property>, @InjectRepository(PropertyListImages) private readonly listImagesrepos: Repository<PropertyListImages>, @InjectRepository(PropertyMeta) private readonly metasRepos: Repository<PropertyMeta>) { }

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
      await this.listImagesrepos.createQueryBuilder().insert().values(ls).execute();
    }

    if (typeof metas != 'undefined' && metas.length > 0) {
      let ls = [];
      metas.forEach(val => {
        ls.push({ property: propSaved.identifiers[0].id, master: val });
      })
      await this.metasRepos.createQueryBuilder().insert().values(ls).execute();
    }

    return { ...property };
  }

  async findAll(option: MetaQuery = null, fields: string[] = null): Promise<Property[]> {
    const query = this.repos.createQueryBuilder('prop').select("prop.id", "prop_id");
    let select = [];
    if (fields != null && fields.length > 0) {
      fields.forEach(val => {
        switch (val) {
          case 'property_featured_image':
            query.leftJoinAndSelect(`prop.${val}`, `prop_${val}`).addSelect([`prop_${val}.id`]);
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
          case 'id':
            break;
          default:
            select.push(`prop.${val}`);
            break;
        }
      });

      if(select.length > 0){
        query.addSelect(select);
      }
    }
    if(option != null){
      if(typeof option.take != 'undefined'){
        query.limit(option.take);
      }
      if(typeof option.page != 'undefined'){
        query.offset((option.page - 1) * option.take);
      }
      
      if(typeof option.where != 'undefined' && option.where.length > 0){
        for (let index = 0; index < option.where.length; index++) {
          // const element = array[index];
          let obj = {};
          if(option.where[index].operator == 'LIKE'){
            obj[option.where[index].key] = ILike(`%${option.where[index].value}%`);  
          }else{
            obj[option.where[index].key] = option.where[index].value;  
          }
          // obj[option.where[index].key] = option.where[index].value;

          if(index == 0){
            query.where(obj);
          }else{
            if(option.where[index].nextOperator == 'OR'){
              query.orWhere(obj);
            }else{
              query.andWhere(obj);
            }
          }
        }
      }

      if(typeof option.sortBy != 'undefined' && option.sortBy.length > 0){
        for (let index = 0; index < option.sortBy.length; index++) {
          // const element = array[index];
          query.addOrderBy(`prop.${option.sortBy[index].key}`, option.sortBy[index].isAsc ? "ASC" : "DESC");
        }
      }
    }
    return await query.getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} property`;
  }

  update(id: number, updatePropertyInput: UpdatePropertyInput) {
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }
}
