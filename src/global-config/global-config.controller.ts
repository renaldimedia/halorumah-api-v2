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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.globalConfigService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGlobalConfigDto: UpdateGlobalConfigDto) {
    return this.globalConfigService.update(+id, updateGlobalConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.globalConfigService.remove(+id);
  }
}
