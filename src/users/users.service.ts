import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import Role from '../enums/roles.enum';
import { UpdateUserInput } from './dto/update-user.input';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRespository: Repository<User>
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRespository.find();
  }

  findByEmail(email: string): Promise<User> {
    return this.usersRespository.findOne({ where: {email: email} });
  }

  async findById(id: string): Promise<User>{
    const result = await this.usersRespository.findOneBy({id:id});
    console.log(result);
    return result;
  }

  findOneBy(search: any): Promise<User>{
    return this.usersRespository.findOneBy(search);
  }

  findByRole(rol: string): Promise<User[]> {
    // this.usersRespository.findBy()
    return this.usersRespository.findBy({role: Role[rol.toUpperCase()] as keyof typeof Role})
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
