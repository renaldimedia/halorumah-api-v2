import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User, UsersResponse } from './entities/user.entity';
import Role from '../enums/roles.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { FilesService } from 'src/files/files.service';
import { CountriesService } from 'src/countries/countries.service';
import { ProvincesService } from 'src/provinces/provinces.service';
import { SubdistrictsService } from 'src/subdistricts/subdistricts.service';
import { CitiesService } from 'src/cities/cities.service';
import roleDisplay from 'src/enums/roleDisplay';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRespository: Repository<User>, private readonly fileService: FilesService, private readonly subdistrictsService: SubdistrictsService, private readonly countryService: CountriesService, private readonly provincesService: ProvincesService, private readonly citiesService: CitiesService
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRespository.find();
  }

  findByEmail(email: string): Promise<User> {
    // console.log('findbyemail');
    return this.usersRespository.findOne({ where: {email: email} });
  }

  async findById(id: string, publicOnly: boolean = false, fields: any = []): Promise<UsersResponse>{
    // const result = await this.usersRespository.findOneBy({id:id});
  
    // console.log('findbyid');
    // let select = {};
    // if(publicOnly){
    //   select['province'] = false;
    // }
    const users = await this.usersRespository.findOne({
      where: {id:id}
    });
    const response = new UsersResponse();
    // console.log(users);


    Object.entries(users).forEach(([key,val]) => {
      switch (key) {
        // case 'photo_profile':
        //   response[key] = new File()
        // break;
        // case 'province':
        //   response[key] = new Province()
        // break;
        // case 'country':
        //   response[key] = new Country()
        // break;
        // case 'city':
        //   response[key] = new City()
        // break;
        // case 'subdistrict':
        //   response[key] = val
        // break;
      
        default:
          response[key] = val;
          break;
      }
    });

    let addr = "";

    if(users.role != null){
      response.role = roleDisplay[users.role];
    }
    
    if (users.photo_profile != null && typeof users.photo_profile == 'string') {
      response.photo_profile = await this.fileService.findOne(users.photo_profile);
    }
    if(typeof users.full_address != 'undefined' && users.full_address != null){
      addr += users.full_address.trim();
    }
    if(users.subdistrict != null && typeof users.subdistrict == 'number'){
      response.subdistrict = await this.subdistrictsService.findOne(users.subdistrict);
      addr += typeof response.subdistrict != 'undefined' ? " " + response.subdistrict.subdistrict_name : "";
    }
    if(users.city != null && typeof users.city == 'number'){
      response.city = await this.citiesService.findOne(users.city);
      addr += typeof response.city != 'undefined' ? " " + response.city.city_name : "";
    }
    if(users.province != null && typeof users.province == 'number'){
      response.province = await this.provincesService.findOne(users.province);
      addr += typeof response.province != 'undefined' ? " " + response.province.province_name : "";
    }
    if(users.country != null && typeof users.country == 'number'){
      response.country = await this.countryService.findOne(users.country);
      addr += typeof response.country != 'undefined' ? " " + response.country.country_name : "";
    }
   
    
    response.full_address_rendered = addr.trim();


   
    // console.log(users);
    return response;
  }

  findOneBy(search: any): Promise<User>{
    console.log('findby');
    return this.usersRespository.findOneBy(search);
  }

  async findByRole(rol: string): Promise<UsersResponse[]> {
    // this.usersRespository.findBy()
    let q = await this.usersRespository.findBy({role: Role[rol.toUpperCase()] as keyof typeof Role});
    let responses = [];
    for(let i = 0 ; i < q.length ; i++){
      let users = q[i];
      const response = new UsersResponse();
      // console.log(users);
  
  
      Object.entries(users).forEach(([key,val]) => {
        switch (key) {
          // case 'photo_profile':
          //   response[key] = new File()
          // break;
          // case 'province':
          //   response[key] = new Province()
          // break;
          // case 'country':
          //   response[key] = new Country()
          // break;
          // case 'city':
          //   response[key] = new City()
          // break;
          // case 'subdistrict':
          //   response[key] = val
          // break;
        
          default:
            response[key] = val;
            break;
        }
      });
  
      let addr = "";
      if(users.role != null){
        response.role = roleDisplay[users.role];
      }
      if (users.photo_profile != null && typeof users.photo_profile == 'string') {
        response.photo_profile = await this.fileService.findOne(users.photo_profile);
        
      }
      if(typeof users.full_address != 'undefined' && users.full_address != null){
        addr += users.full_address.trim();
      }
      if(users.subdistrict != null && typeof users.subdistrict == 'number'){
        response.subdistrict = await this.subdistrictsService.findOne(users.subdistrict);
        addr += typeof response.subdistrict != 'undefined' ? " " + response.subdistrict.subdistrict_name : "";
      }
      if(users.city != null && typeof users.city == 'number'){
        response.city = await this.citiesService.findOne(users.city);
        addr += typeof response.city != 'undefined' ? " " + response.city.city_name : "";
      }
      if(users.province != null && typeof users.province == 'number'){
        response.province = await this.provincesService.findOne(users.province);
        addr += typeof response.province != 'undefined' ? " " + response.province.province_name : "";
      }
      if(users.country != null && typeof users.country == 'number'){
        response.country = await this.countryService.findOne(users.country);
        addr += typeof response.country != 'undefined' ? " " + response.country.country_name : "";
      }
     
      
      response.full_address_rendered = addr.trim();
      responses.push(response);
    }
    return responses;
  }

  async update(input: UpdateUserInput, id: string){
    if(input.id == null){
      input.id = id;
    }
    const result = await this.usersRespository.update({id: input.id}, input);
    // console.log(input);
    if(result.affected > 0){
      return input;
    }
    
    throw new Error("Gagal mengupdate profile!");
    
  }

  async delete(userid:string): Promise<User> {
    try {
      const data = await this.usersRespository.findOneBy({id:userid});
      if(data == null){
        throw new Error("User tidak ditemukan!");
      }
      const result = await this.usersRespository.remove(data);
      result.messages = "Berhasil menghapus user!"
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  async create(createUserInput: CreateUserInput) {
    // console.log(createUserInput)
    const user = this.usersRespository.create(createUserInput);
    return await this.usersRespository.save(user);
  }
}
