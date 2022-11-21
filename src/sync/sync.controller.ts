import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SyncService } from './sync.service';
import { CreateSyncDto } from './dto/create-sync.dto';
import { UpdateStatSyncDto, UpdateSyncDto } from './dto/update-sync.dto';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  create(@Body() createSyncDto: CreateSyncDto) {
    return this.syncService.create(createSyncDto);
  }

  @Patch('stat')
  updateStat(@Body() updateSyncDto: UpdateStatSyncDto) {
    return this.syncService.updateStat( updateSyncDto.id, updateSyncDto);
  }

  @Get('property')
  findAll() {
    return this.syncService.findAll('property');
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.syncService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSyncDto: UpdateSyncDto) {
    return this.syncService.update(+id, updateSyncDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.syncService.remove(+id);
  }
}
