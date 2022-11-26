import { Injectable } from '@nestjs/common';
import { CreateUserPackageInput } from './dto/create-user-package.input';
import { UpdateUserPackageInput } from './dto/update-user-package.input';

@Injectable()
export class UserPackagesService {
  create(createUserPackageInput: CreateUserPackageInput) {
    return 'This action adds a new userPackage';
  }

  findAll() {
    return `This action returns all userPackages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPackage`;
  }

  update(id: number, updateUserPackageInput: UpdateUserPackageInput) {
    return `This action updates a #${id} userPackage`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPackage`;
  }
}
