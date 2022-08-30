import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PropertyResponse } from './entities/get-all-props.response';
import { PropertiesService } from './properties.service';

@Controller('property')
export class PropertiesController {
  constructor(private readonly service: PropertiesService) {}

//   @Get()
//   findAll() {
//     return this.service.findAll();
//   }

  @Get(':id')
  findOne(@Query('id') id: number): Promise<PropertyResponse> {
    const fields = ['*'];
    return this.service.findOne(id, fields, true);
  }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateTestReDto: UpdateTestReDto) {
//     return this.service.update(+id, updateTestReDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.service.remove(+id);
//   }
}
