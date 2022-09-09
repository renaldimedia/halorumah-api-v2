import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { Repository } from 'typeorm';
import { CreateLeadInput } from './dto/create-lead.input';
import { UpdateLeadInput } from './dto/update-lead.input';
import { Lead, LeadResponse } from './entities/lead.entity';

@Injectable()
export class LeadsService {
  constructor(@InjectRepository(Lead) private readonly repos: Repository<Lead>) { }

  async create(createLeadInput: CreateLeadInput) {
    const lead = new Lead();
    let extra = typeof createLeadInput.extra != 'undefined' ? createLeadInput.extra : null;
    lead.extra = "";
    Object.entries(createLeadInput).forEach(([key,val]) => {
      if(key == 'extra' && extra != null){
        lead.extra = JSON.stringify(extra);
      }else{
        lead[key] = val;
      }
    });
    const pr = this.repos.create(lead);
    const res = await this.repos.insert(pr);

    return { ...createLeadInput };
  }

  async findAll(option: MetaQuery = null, fields: string[] = null): Promise<LeadResponse[]> {
    const query = this.repos.createQueryBuilder('leads');
    // const select = [];
    if(fields != null && fields.length > 0){
      query.select("leads.id", "leads_id");
      for(let i = 0 ; i < fields.length ; i ++){
        query.addSelect(fields[i]);
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
          let tbl = "leads";
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
          query.addOrderBy(`leads.${option.sortBy[index].key}`, option.sortBy[index].isAsc ? "ASC" : "DESC");
        }
      }
    }

    const result = await query.getMany();
    // console.log(result)
    // const response = new LeadResponse();
    const response = [];
    
    for(let i = 0 ; i < result.length ; i ++){
      let lr = new LeadResponse();
      Object.entries(result[i]).forEach(([key,val]) => {
          // console.log(typeof val)
        if(key == 'extra' && typeof val == 'string' && val != null && val != ""){
          // console.log(JSON.parse(val))
          lr.extra = JSON.parse(val);
        }else if(key == 'extra' && typeof val == 'object' && val == null && val.length > 0){
          lr.extra = val;
        }
        else if(key == 'extra' && typeof val == 'string' && val == null){
          lr.extra = [];
        }else{
          lr[key] = val;
        }

      });
      response.push(lr);
    }
    // console.log(response);

    return response;
  }

  async findOne(id: number): Promise<Lead> {
    return await this.repos.findOneBy({id:id});
  }

  update(id: number, updateLeadInput: UpdateLeadInput) {
    return `This action updates a #${id} lead`;
  }

  remove(id: number) {
    return `This action removes a #${id} lead`;
  }
}
