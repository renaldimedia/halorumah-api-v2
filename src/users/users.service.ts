import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { CompanyInput } from './dto/company.input';
import { Company } from './entities/company.entity';
import { Package } from 'src/packages/entities/package.entity';
import { UserPackages } from './entities/user-packages.entity';
import { use } from 'passport';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRespository: Repository<User>, private readonly fileService: FilesService, private readonly subdistrictsService: SubdistrictsService, private readonly countryService: CountriesService, private readonly provincesService: ProvincesService, private readonly citiesService: CitiesService, @InjectRepository(Company) private companiesRepo: Repository<Company>, @InjectRepository(Package) private packageRepo: Repository<Package>, @InjectRepository(UserPackages) private userPackageRepo: Repository<UserPackages>
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRespository.find();
  }

  findByEmail(email: string): Promise<User> {
    // console.log('findbyemail');
    return this.usersRespository.findOne({ where: { email: email } });
  }

  async createCompany(input: CompanyInput) {
    // const res = new Company();

    const cp = this.companiesRepo.create(input);
    return await this.companiesRepo.save(cp);
  }

  async proccesUser(users: User, response: UsersResponse) {
    // console.log(users);
    if(users == null){
      return response;
    }
    Object.entries(users).forEach(([key, val]) => {
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

    if (users.role != null) {
      response.role = roleDisplay[users.role];
    }

    if (users.photo_profile != null && typeof users.photo_profile == 'string') {
      response.photo_profile = await this.fileService.findOne(users.photo_profile);
    }
    if (typeof users.full_address != 'undefined' && users.full_address != null) {
      addr += users.full_address.trim();
    }
    if (users.subdistrict != null && typeof users.subdistrict == 'number') {
      response.subdistrict = await this.subdistrictsService.findOne(users.subdistrict);
      addr += typeof response.subdistrict != 'undefined' ? " " + response.subdistrict.subdistrict_name : "";
    }
    if (users.city != null && typeof users.city == 'number') {
      response.city = await this.citiesService.findOne(users.city);
      addr += typeof response.city != 'undefined' ? " " + response.city.city_name : "";
    }
    if (users.province != null && typeof users.province == 'number') {
      response.province = await this.provincesService.findOne(users.province);
      addr += typeof response.province != 'undefined' ? " " + response.province.province_name : "";
    }
    if (users.country != null && typeof users.country == 'number') {
      response.country = await this.countryService.findOne(users.country);
      addr += typeof response.country != 'undefined' ? " " + response.country.country_name : "";
    }
    
    let pack = await this.userPackageRepo.find({
      relations: {
        package: true
      },
      where: {
        user: {
          id: users.id
        },
        status: 1,
      }
    });

    if(pack != null && pack.length > 0){
      response.package = pack[0].package;
    }

    response.full_address_rendered = addr.trim();

    return response;
  }

  async findById(id: string, publicOnly: boolean = false, fields: any = []): Promise<UsersResponse> {

    const users = await this.usersRespository.findOne({
      where: { id: id }
    });
    
    const response = new UsersResponse();
   
    let res = this.proccesUser(users, response);

    return res;
  }

  async findOneBy(search: any): Promise<UsersResponse> {
    console.log('findby');
    const users = await this.usersRespository.findOneBy(search);
    const response = new UsersResponse();
    
    let res = this.proccesUser(users, response);

    return res;
  }

  async findByDevice(deviceid: string): Promise<UsersResponse> {
    // async findOneBy(search: any, publicOnly: boolean = false, fields: any = []): Promise<UsersResponse>{
    const users = await this.usersRespository.findOne({
      where: { device_id: deviceid }
    });
    const response = new UsersResponse();
    // console.log(users);


    Object.entries(users).forEach(([key, val]) => {
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

    if (users.role != null) {
      response.role = roleDisplay[users.role];
    }

    if (users.photo_profile != null && typeof users.photo_profile == 'string') {
      response.photo_profile = await this.fileService.findOne(users.photo_profile);
    }
    if (typeof users.full_address != 'undefined' && users.full_address != null) {
      addr += users.full_address.trim();
    }
    if (users.subdistrict != null && typeof users.subdistrict == 'number') {
      response.subdistrict = await this.subdistrictsService.findOne(users.subdistrict);
      addr += typeof response.subdistrict != 'undefined' ? " " + response.subdistrict.subdistrict_name : "";
    }
    if (users.city != null && typeof users.city == 'number') {
      response.city = await this.citiesService.findOne(users.city);
      addr += typeof response.city != 'undefined' ? " " + response.city.city_name : "";
    }
    if (users.province != null && typeof users.province == 'number') {
      response.province = await this.provincesService.findOne(users.province);
      addr += typeof response.province != 'undefined' ? " " + response.province.province_name : "";
    }
    if (users.country != null && typeof users.country == 'number') {
      response.country = await this.countryService.findOne(users.country);
      addr += typeof response.country != 'undefined' ? " " + response.country.country_name : "";
    }


    response.full_address_rendered = addr.trim();



    // console.log(users);
    return response;
    // }
  }

  async findByRole(rol: string): Promise<UsersResponse[]> {
    // this.usersRespository.findBy()
    let q = await this.usersRespository.findBy({ role: Role[rol.toUpperCase()] as keyof typeof Role });
    let responses = [];
    for (let i = 0; i < q.length; i++) {
      let users = q[i];
      const response = new UsersResponse();
      // console.log(users);


      Object.entries(users).forEach(([key, val]) => {
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
      if (users.role != null) {
        response.role = roleDisplay[users.role];
      }
      if (users.photo_profile != null && typeof users.photo_profile == 'string') {
        response.photo_profile = await this.fileService.findOne(users.photo_profile);

      }
      if (typeof users.full_address != 'undefined' && users.full_address != null) {
        addr += users.full_address.trim();
      }
      if (users.subdistrict != null && typeof users.subdistrict == 'number') {
        response.subdistrict = await this.subdistrictsService.findOne(users.subdistrict);
        addr += typeof response.subdistrict != 'undefined' ? " " + response.subdistrict.subdistrict_name : "";
      }
      if (users.city != null && typeof users.city == 'number') {
        response.city = await this.citiesService.findOne(users.city);
        addr += typeof response.city != 'undefined' ? " " + response.city.city_name : "";
      }
      if (users.province != null && typeof users.province == 'number') {
        response.province = await this.provincesService.findOne(users.province);
        addr += typeof response.province != 'undefined' ? " " + response.province.province_name : "";
      }
      if (users.country != null && typeof users.country == 'number') {
        response.country = await this.countryService.findOne(users.country);
        addr += typeof response.country != 'undefined' ? " " + response.country.country_name : "";
      }


      response.full_address_rendered = addr.trim();
      responses.push(response);
    }
    return responses;
  }

  async update(input: UpdateUserInput, id: string) {
    if (input.id == null) {
      input.id = id;
    }
    const result = await this.usersRespository.update({ id: input.id }, input);
    // console.log(input);
    if (result.affected > 0) {
      return input;
    }

    throw new Error("Gagal mengupdate profile!");

  }

  async delete(userid: string): Promise<User> {
    try {
      const data = await this.usersRespository.findOneBy({ id: userid });
      if (data == null) {
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
   
    // const password = await bcrypt.hash(signupUserInput.password, 10);
    try {
      const {package_code, package_registered, package_banefit, package_status} = createUserInput
      // let pck = null;
      // let user = null;
      let user = this.usersRespository.create(createUserInput);
      user = await this.usersRespository.save(user);
      let result = {...user};
      if(typeof package_code != 'undefined' && package_code != null){
          let pck = await this.packageRepo.findOneBy({package_code: package_code});
          if(pck != null && typeof pck['id'] != 'undefined'){
            const usrpck = new UserPackages();
            usrpck.package = pck;
            usrpck.user = user;
            usrpck.registered_date = package_registered;
            usrpck.banefit = package_banefit;
            usrpck.status = package_status;
            const re = await this.userPackageRepo.save(usrpck);
            result['package'] = pck;
          }
      }
      
      return result;
    } catch (error) {
      console.log(error)
      throw new HttpException({
        message: "Confirm password harus sama!",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: JSON.stringify(error)
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}
