import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GlobalConfigService } from './global-config.service';
import { CreateGlobalConfigDto } from './dto/create-global-config.dto';
import { UpdateGlobalConfigDto } from './dto/update-global-config.dto';

@Controller('config')
export class GlobalConfigController {
  constructor(private readonly globalConfigService: GlobalConfigService) {}

  @Post()
  create(@Body() createGlobalConfigDto: CreateGlobalConfigDto) {
    return this.globalConfigService.create(createGlobalConfigDto);
  }

  @Get('getconfig')
  findAll() {
    return this.globalConfigService.findAll();
  }

}
