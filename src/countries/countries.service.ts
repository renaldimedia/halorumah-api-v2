import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from 'src/provinces/entities/province.entity';
import { ILike, Like, Repository } from 'typeorm';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {

  constructor(
    @InjectRepository(Country) private countriesRespository: Repository<Country>,@InjectRepository(Province) private provincesRespository: Repository<Province>
  ) {}

  async create(createCountryInput: CreateCountryInput) {
    let ctr = new Country();
    const {province} = createCountryInput;
    ctr.country_name = createCountryInput.country_name;
    ctr.country_code = createCountryInput.country_code;
    ctr.id = createCountryInput.id;
    let provinces: Province[] = [];
    if(province.length > 0){
      for(let i = 0 ; i < province.length ; i ++){
        let prv = this.provincesRespository.create(province[i]);
        provinces.push(prv);
      }
    }
    ctr.provinces = provinces;
    const ct = this.countriesRespository.create(ctr);
    return await this.countriesRespository.save(ct);
  }

  findAll(keyword: string = ""): Promise<Country[]> {
    const py = {where: null};
    if(keyword != null && keyword != ""){
      py['where'] = []
      py['where'].push({country_name: ILike(`%${keyword}%`)});
    }
    // console.log(JSON.stringify(py))
    return this.countriesRespository.find(py);
  }

  findOne(id: number, fields: any[] = null): Promise<Country> {
    const py = {where: {id:id}};
    return this.countriesRespository.findOne(py);
  }

  async update(id: number, updateCountryInput: UpdateCountryInput) {
    const result = await this.countriesRespository.update({id: id}, updateCountryInput);
    if(result.affected > 0){
        return updateCountryInput;
    }
    throw new Error("Gagal mengupdate country");
  }

  async remove(id: number) {
    const result = await this.countriesRespository.delete({id: id});
    if(result.affected > 0){
      return {id: id}
    }
    throw new Error("Gagal menghapus country");
  }
}
