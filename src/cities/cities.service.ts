import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { DataSource, ILike, Like, Repository } from 'typeorm';
import { CreateCityInput } from './dto/create-city.input';
import { UpdateCityInput } from './dto/update-city.input';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City) private citiesRepository: Repository<City>,@InjectDataSource() private datasource: DataSource
  ) {}
  
  create(createCityInput: CreateCityInput) {
    const ct = this.citiesRepository.create(createCityInput);
    return this.citiesRepository.save(ct);
    // return 'This action adds a new city';
  }

  findAll(keyword: string = "", province_id: number = null, fields: string[] = null): Promise<City[]> {
    const py = {where: null};
    if((keyword != null && keyword != "") || (province_id != null)){
      py.where = [];
    }
    if(keyword != null && keyword != ""){
      py['where'].push({city_name: ILike(`%${keyword}%`)});
    }
    if(province_id != null){
      py['where'].push({province_id: province_id});
    }
    return this.citiesRepository.find(py);
  }

  findOne(id: number): Promise<City> {
    return this.citiesRepository.findOneBy({id: id});
  }

  async update(id: number, updateCityInput: UpdateCityInput) {
    const response = new GlobalMutationResponse();
    try {
      const result = await this.citiesRepository.update({id: id}, updateCityInput);
      
      if(result.affected > 0){
        response.affected = result.affected;
        response.message = "Berhasil mengubah data city!";
        response.errors = []

        return response;
      }

      response.affected = 0;
      response.message = "Gagal mengubah data city!";
      return response;
    } catch (error) {
      response.affected = 0;
      response.errors.push(error);
      response.message = "Gagal mengubah data city!";

      return response;
    }
    
  }

  async findAllOne(id: number): Promise<any>{
    const result = await this.datasource.query(`SELECT * FROM city as c LEFT JOIN province as p ON c.province_id = p.id WHERE c.id = ${id}`);

                  return result;
  }

  async remove(id: number) {
    const response = new GlobalMutationResponse();
    try {
      const result = await this.citiesRepository.delete({id: id});
      if(result.affected > 0){
        response.affected = result.affected;
        response.message = "Berhasil menghapus data city!";
        response.errors = []

        return response;
      }
      response.affected = 0;
      response.message = "Gagal menghapus data city!";
      return response;
    } catch (error) {
      response.affected = 0;
      response.errors.push(error);
      response.message = "Gagal menghapus data city!";

      return response;
    }
    // return this.citiesRepository.delete({id: id});
    // return `This action removes a #${id} city`;
  }
}
