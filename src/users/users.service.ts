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
import { UserPackages } from '../user-packages/entities/user-packages.entity';
import { use } from 'passport';
import { BuyPackageInput } from '../user-packages/dto/buy-package.input';
import { GraphQLError } from 'graphql';
import { HttpService } from '@nestjs/axios';
import { globalConfig } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRespository: Repository<User>, private readonly fileService: FilesService, private readonly subdistrictsService: SubdistrictsService, private readonly countryService: CountriesService, private readonly provincesService: ProvincesService, private readonly citiesService: CitiesService, @InjectRepository(Company) private companiesRepo: Repository<Company>, @InjectRepository(Package) private packageRepo: Repository<Package>, @InjectRepository(UserPackages) private userPackageRepo: Repository<UserPackages>, private readonly httpService: HttpService
  ) { }

  async findAll(option: MetaQuery = null, fields: string[] = null): Promise<any> {
    if(option == null ){
      return await this.usersRespository.find();
    }
    let tbl = "usr";
    const query = this.usersRespository.createQueryBuilder(tbl).select(tbl + ".id", tbl + "_id");
    let select = [];

    if (fields != null && fields.length > 0) {
      fields.forEach(val => {
        switch (val) {
          case 'userpackages':
            query.leftJoinAndSelect(`${tbl}.${val}`, `${tbl}_${val}`).addSelect([`${tbl}_${val}.*`]);
            break;
            case 'country':
              query.leftJoinAndSelect(`${tbl}.${val}`, `${tbl}_${val}`).addSelect([`${tbl}_${val}.id`]);
              break;
            case 'province':
              query.leftJoinAndSelect(`${tbl}.${val}`, `${tbl}_${val}`).addSelect([`${tbl}_${val}.id`]);
              break;
            case 'city':
              query.leftJoinAndSelect(`${tbl}.${val}`, `${tbl}_${val}`).addSelect([`${tbl}_${val}.id`]);
              break;
            case 'subdistrict':
              query.leftJoinAndSelect(`${tbl}.${val}`, `${tbl}_${val}`).addSelect([`${tbl}_${val}.id`]);
              break;
          case 'package':
            break;
          default:
            select.push(`${tbl}.${val}`);
            break;
        }
      });

      if (select.length > 0) {
        query.addSelect(select);
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
          let tbll = tbl;
          if (typeof option.where[index].table != 'undefined') {
            tbll = option.where[index].table;
          }
          if (option.where[index].operator == 'LIKE') {
            obj[option.where[index].key] = `ILike '%${option.where[index].value}%'`;
          } else if(option.where[index].operator == '>'){
            obj[option.where[index].key] = `= '${option.where[index].value}'`;
          }

          else {
            obj[option.where[index].key] = `= '${option.where[index].value}'`;
          }

          if (index == 0) {
            query.where(`${tbll}.${option.where[index].key} ${obj[option.where[index].key]}`);
          } else if (index > 0) {
            if (option.where[index].nextOperator == 'OR') {
              query.orWhere(`${tbll}.${option.where[index].key} ${obj[option.where[index].key]}`);
            } else {
              query.andWhere(`${tbll}.${option.where[index].key} ${obj[option.where[index].key]}`);
            }
          }
        }
      }

      if (typeof option.sortBy != 'undefined' && option.sortBy.length > 0) {
        for (let index = 0; index < option.sortBy.length; index++) {
          // const element = array[index];
          query.addOrderBy(`${tbl}.${option.sortBy[index].key}`, option.sortBy[index].isAsc ? "ASC" : "DESC");
        }
      }
    }
    // console.log(query)
    const res = await query.getMany();
    return res;
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

  async resetPassword(input: UpdateUserInput, code: string) {
    code = input.reset_password_code;
    input.reset_password_code = "";
    input.reset_password_count = 0;
    input.last_reset_password = new Date();
    const result = await this.usersRespository.update({ reset_password_code: code }, input);
    // console.log(result);
    const res = new GlobalMutationResponse();
    res.affected = result.affected;
   
    res.message = "Gagal mengupdate password!";
    if (result.affected > 0) {
        res.ok = true;
        res.message = "Berhasil melakukan reset password!";
    }

    // throw new GraphQLError("Gagal mengupdate password!");
    return res;

  }

  async updatePackage(input: BuyPackageInput, id: string): Promise<any> {
    if (input.id == null) {
      input.id = id;
    }
    const pack = await this.packageRepo.findOneBy({package_code: input.package_code});
    if(pack != null && pack.package_price > 0){
      const srpc = new UserPackages();
      const usr = await this.usersRespository.findOneBy({id: input.id});
      // usr.id = input.id;
      input.payment_user_email = usr.email;
      input.payment_total = pack.package_price;
      input.payment_user_name = usr.full_name;
      input['payment_detail'] = {
        purchase_detail: [
          {
            item_name: pack.package_display_name,
            item_price: pack.package_price,
            item_category: "membership",
            item_qty: 1
          }
        ]
      }
      srpc.package = pack;
      srpc.user = usr;
      const res = await this.userPackageRepo.save(srpc);

      if(input.payment_type == ""){
        input.payment_type = "membership";
      }
      input['callback_url'] = globalConfig.BASE_URL + "api/user/activate-package/" + encodeURI(res.user.id) + "/" + res.id;
      if(res != null && typeof res.id == 'number'){
        const payment = await firstValueFrom(this.httpService.post(`${globalConfig.PAYMENT_ENDPOINT}/payment`, input));
        // console.log(payment);
        
        let inv = "";
        if(payment != null && typeof payment != 'undefined' && typeof payment['data']['data'] != 'undefined'){
          inv = payment['data']['data']['invoice_url'];
        }

        return {
          ...res,
          invoice_url: inv
        };
      }
      throw new GraphQLError("Gagal membeli paket!");  
    }else if(pack == null){
      throw new GraphQLError("Tidak ada data paket!");  
    }

    throw new GraphQLError("Terjadi kesalahan!");
  }

  async activatePackage(id: number, status: number){

    // const userpack = await this.userPackageRepo.findOneBy({id: id})
    let st = 0;
    if(status == 2){
      st = 1;
    }
    return await this.userPackageRepo.update({id: id, payment_status: 0}, {payment_status: status, status: st});
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
    try {
      const {package_code, package_registered, package_banefit, package_status} = createUserInput
      // let usr = new User();
      // Object.keys(createUserInput).forEach(k => {
      //   usr[k] = createUserInput[k];
      // })
      let user = this.usersRespository.create(createUserInput);
      
      user = await this.usersRespository.save(user);
      let result = user;
      if(typeof package_code != 'undefined' && package_code != null){
          let pck = await this.packageRepo.findOneBy({package_code: package_code});
          if(pck != null && typeof pck['id'] != 'undefined'){
            const usrpck = new UserPackages();
            usrpck.package = pck;
            usrpck.user = user;
            if(typeof package_registered != 'undefined' && package_registered != null){
              usrpck.registered_date = package_registered;
            }
            if(typeof package_banefit != 'undefined' && package_banefit != null){
              usrpck.banefit = package_banefit;
              usrpck.package_listings = package_banefit.package_listings;
              usrpck.package_featured_listings = typeof package_banefit.package_featured_listings != 'undefined' ? package_banefit.package_featured_listings : 0;
              usrpck.vnov_credit = typeof package_banefit.vnov_credit != 'undefined' ? package_banefit.vnov_credit : 0;
            }
            if(typeof package_status != 'undefined' && package_status != null){
              usrpck.status = package_status;
            }
            
            const re = await this.userPackageRepo.save(usrpck);
            if(re != null && typeof re.id == 'number'){
              result['package'] = pck;
            }
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
