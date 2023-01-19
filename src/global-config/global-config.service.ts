import { Injectable } from '@nestjs/common';
import { CreateGlobalConfigDto } from './dto/create-global-config.dto';
import { UpdateGlobalConfigDto } from './dto/update-global-config.dto';
import { cfg } from 'src/config';
@Injectable()
export class GlobalConfigService {
  create(createGlobalConfigDto: CreateGlobalConfigDto) {
    return 'This action adds a new globalConfig';
  }

  findAll() {
    return cfg;
  }
}
