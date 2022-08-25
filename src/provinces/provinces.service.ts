import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Pagination, PaginationOptionsInterface } from 'src/paginate';
import { ILike, Like, Repository } from 'typeorm';
import { CreateProvinceInput } from './dto/create-province.input';
import { UpdateProvinceInput } from './dto/update-province.input';
import { Province } from './entities/province.entity';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';

@Injectable()
export class ProvincesService {
  constructor(
  @InjectRepository(Province) private provincesRespository: Repository<Province>
  ) {}
  
  async create(createProvinceInput: CreateProvinceInput) {
    const prov = new Province();
    Object.entries(createProvinceInput).forEach(([key,val]) => {
      prov[key] = val;
    });
    const data = this.provincesRespository.create(prov);
    return await this.provincesRespository.save(data);
  }

  findAll(keyword: string = null, country_id: number = null, fields: any[] = null): Promise<Province[]> {
    
     const py = {where: null};
     if(keyword != null || country_id != null){
      py['where'] = [];
     }
    if(keyword != null && keyword != ""){
      py['where'].push({province_name: ILike(`%${keyword}%`)});
    }
    if(country_id != null){
      py['where'].push({country_id: country_id});
    }
    console.log(py);
    // const [results, total] = await this.provincesRespository.findAndCount(py);
    // return new Pagination<Province>({
    //   results,
    //   total,
    // });
    return this.provincesRespository.find(py);
  }
 
  findOne(id: number, fields: string[] = null): Promise<Province> {
    const py = {select: [], where: {id:id}}
    if(fields != null){
      py['select'] = fields;
    }
    return this.provincesRespository.findOne(py);
  }

  async update(id: number, updateProvinceInput: UpdateProvinceInput) {
    const result = await this.provincesRespository.update({id: id}, updateProvinceInput);
    const response = new GlobalMutationResponse();
    if(result.affected > 0){
      response.affected = result.affected;
      response.message = "Berhasil mengubah data provinsi!";
      return response;
    }
    response.affected = 0;
    response.message = "Gagal mengubah data provinsi!";

    return response;
    
  }

  async remove(id: number) {
    const result = await this.provincesRespository.delete({id:id});
    const response = new GlobalMutationResponse();
    if(result.affected > 0){
      response.affected = result.affected;
      response.message = "Berhasil menghapus data provinsi!";
      return response;
    }
    response.affected = 0;
      response.message = "Gagal menghapus data provinsi!";

      return response;
    
  }
}
