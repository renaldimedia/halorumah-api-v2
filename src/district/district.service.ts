import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { DataSource, ILike, Repository } from 'typeorm';
import { CreateDistrictInput } from './dto/create-district.input';
import { UpdateDistrictInput } from './dto/update-district.input';
import { District } from './entities/district.entity';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District) private districtsRespository: Repository<District>,
    @InjectDataSource() private datasource: DataSource
  ) {}
  
  create(createDistrictInput: CreateDistrictInput) {
    const dt = this.districtsRespository.create(createDistrictInput);
    return this.districtsRespository.save(dt);
    // return 'This action adds a new district';
  }

  findAll(group_id: number = null, keyword: string = null): Promise<District[]> {
    const py = {where: null, relations: ['city', 'city.province', 'city.province.country']};
    if(keyword != null || group_id != null){
     py['where'] = [];
    }
    if(group_id != null){
      py['where'].push({city: {id: group_id}});
    }
    if(keyword != null && keyword != ""){
      py['where'].push({district_name: ILike(`%${keyword}%`)});
    }
    return this.districtsRespository.find(py);
    // return `This action returns all districts`;
  }

  findOne(id: number): Promise<District> {
    return this.districtsRespository.findOne({where: {id:id}, relations: ['city', 'city.province', 'city.province.country']});
  }

  async update(id: number, updateDistrictInput: UpdateDistrictInput) {
    const response = new GlobalMutationResponse();
    response.errors = [];
    response.affected = 0;
    response.message = "Gagal mengubah data district";
    try {
      const result = await this.districtsRespository.update({id:id}, updateDistrictInput);
      if(result.affected > 0){
        response.affected = result.affected;
        response.message = "Berhasil mengubah data district!";
        return response;
      }
    } catch (error) {
      
      response.errors.push(error);

      return response;
    }
    return response;
    // return `This action updates a #${id} district`;
  }

  async remove(id: number) {
    const response = new GlobalMutationResponse();
    response.errors = [];
    response.affected = 0;
    response.message = "Gagal menghapus data district";
    try {
      const result = await this.districtsRespository.delete({id:id});
      if(result.affected > 0){
        response.affected = result.affected;
        response.message = "Berhasil menghapus data district!";
        return response;
      }
    } catch (error) {
      response.errors.push(error);
      return response;
    }
    return response;
    // return `This action removes a #${id} district`;
  }
}
