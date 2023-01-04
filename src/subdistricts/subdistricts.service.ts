import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CitiesService } from 'src/cities/cities.service';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { Province } from 'src/provinces/entities/province.entity';
import { Connection, DataSource, ILike, Repository } from 'typeorm';
import { CreateSubdistrictInput } from './dto/create-subdistrict.input';
import { UpdateSubdistrictInput } from './dto/update-subdistrict.input';
import { Subdistrict } from './entities/subdistrict.entity';

@Injectable()
export class SubdistrictsService {
  constructor(
    @InjectRepository(Subdistrict) private subdistrictsRespository: Repository<Subdistrict>,
    private citiesServices: CitiesService, @InjectDataSource() private datasource: DataSource
  ) {}

  // createAll(payload)

  findCityByID(id: number): Promise<City>{
    return this.citiesServices.findOne(id);
  }
  
  create(createSubdistrictInput: CreateSubdistrictInput) {
    const dt = this.subdistrictsRespository.create(createSubdistrictInput);
    return this.subdistrictsRespository.save(dt);
    // return 'This action adds a new subdistrict';
  }

  findAll(group_id: number = null, keyword: string = null): Promise<Subdistrict[]> {
    const py = {where: null, relations: ['city', 'city.province', 'city.province.country']};
    if(keyword != null || group_id != null){
     py['where'] = [];
    }
    if(group_id != null){
      py['where'].push({city: {id: group_id}});
    }
    if(keyword != null && keyword != ""){
      py['where'].push({subdistrict_name: ILike(`%${keyword}%`)});
    }
    return this.subdistrictsRespository.find(py);
    // return `This action returns all subdistricts`;
  }

  findOne(id: number): Promise<Subdistrict> {
    return this.subdistrictsRespository.findOne({where: {id:id}, relations: ['city', 'city.province', 'city.province.country']});
  }

  async update(id: number, updateSubdistrictInput: UpdateSubdistrictInput) {
    const response = new GlobalMutationResponse();
    response.errors = [];
    response.affected = 0;
    response.message = "Gagal mengubah data subdistrict";
    try {
      const result = await this.subdistrictsRespository.update({id:id}, updateSubdistrictInput);
      if(result.affected > 0){
        response.affected = result.affected;
        response.message = "Berhasil mengubah data subdistrict!";
        return response;
      }
    } catch (error) {
      
      response.errors.push(error);

      return response;
    }
    return response;
    // return `This action updates a #${id} subdistrict`;
  }

  async remove(id: number) {
    const response = new GlobalMutationResponse();
    response.errors = [];
    response.affected = 0;
    response.message = "Gagal menghapus data subdistrict";
    try {
      const result = await this.subdistrictsRespository.delete({id:id});
      if(result.affected > 0){
        response.affected = result.affected;
        response.message = "Berhasil menghapus data subdistrict!";
        return response;
      }
    } catch (error) {
      response.errors.push(error);
      return response;
    }
    return response;
    // return `This action removes a #${id} subdistrict`;
  }
}
