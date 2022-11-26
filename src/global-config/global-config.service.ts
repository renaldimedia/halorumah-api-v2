import { Injectable } from '@nestjs/common';
import { CreateGlobalConfigInput } from './dto/create-global-config.input';
import { UpdateGlobalConfigInput } from './dto/update-global-config.input';
import { cfg } from 'src/config';
@Injectable()
export class GlobalConfigService {
  create(createGlobalConfigInput: CreateGlobalConfigInput) {
    return 'This action adds a new globalConfig';
  }

  findAll() {
    return cfg;
    // return `This action returns all globalConfig`;
  }

  findOne(id: number) {
    return `This action returns a #${id} globalConfig`;
  }

  update(id: number, updateGlobalConfigInput: UpdateGlobalConfigInput) {
    return `This action updates a #${id} globalConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} globalConfig`;
  }
}
