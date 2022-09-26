import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isArray } from 'class-validator';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { Property } from 'src/properties/entities/property.entity';
import { User, UsersResponse } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePropertyLikeInput } from './dto/create-property-like.input';
import { UpdatePropertyLikeInput } from './dto/update-property-like.input';
import { PropertyLike } from './entities/property-like.entity';

@Injectable()
export class PropertyLikeService {
  constructor(
    @InjectRepository(PropertyLike) private repo: Repository<PropertyLike>, @InjectRepository(Property) private propRepo: Repository<Property>, @InjectRepository(User) private userRepo: Repository<User>
  ) {}
  
  async create(createPropertyLikeInput: CreatePropertyLikeInput, userid: string) {
    const like = new PropertyLike();
    const prop = await this.propRepo.findOneBy({id:createPropertyLikeInput.property});
    const user = await this.userRepo.findOneBy({id:userid});
    like.property = prop;
    like.user = user;
    const cp = this.repo.create(like);
    return await this.repo.save(cp);
    // return 'This action adds a new propertyLike';
  }

  async findAll(option: MetaQuery = null, fields: string[] = null): Promise<PropertyLike[]> {
    // return `This action returns all propertyLike`;
    let query = this.repo.createQueryBuilder('like');
    // let res = null;
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
      query.andWhere({deleted_at: null});

      if (typeof option.sortBy != 'undefined' && option.sortBy.length > 0) {
        for (let index = 0; index < option.sortBy.length; index++) {
          // const element = array[index];
          query.addOrderBy(`prop.${option.sortBy[index].key}`, option.sortBy[index].isAsc ? "ASC" : "DESC");
        }
      }
    }
    // console.log(query)
    const res = await query.getMany();
    return res;
  }

  async findOne(where): Promise<PropertyLike> {
    // return `This action returns a #${id} propertyLike`;
    const res = await this.repo.findOneBy(where);
    return res;
  }

  update(id: number, updatePropertyLikeInput: UpdatePropertyLikeInput) {
    return `This action updates a #${id} propertyLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} propertyLike`;
  }
}
