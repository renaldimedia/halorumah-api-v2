import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSyncDto } from './dto/create-sync.dto';
import { UpdateSyncDto } from './dto/update-sync.dto';
import { Sync } from './entities/sync.entity';

@Injectable()
export class SyncService {
  constructor(@InjectRepository(Sync) private readonly repos: Repository<Sync>) { }

  async create(createSyncDto: CreateSyncDto) {
    const cr = this.repos.create(createSyncDto);
    return await this.repos.save(cr);
  }

  async updateStat(id: number, updateSyncDto: UpdateSyncDto) {
    const cr = this.repos.update({id: id}, updateSyncDto);
    return cr;
  }

  async findAll(tipe: string = null) {
    if(tipe == null){
      return await this.repos.find();
    }else{
      return await this.repos.find({
        where: {
          data_name: tipe
        }
      })
    }
    // return `This action returns all sync`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sync`;
  }

  update(id: number, updateSyncDto: UpdateSyncDto) {
    return `This action updates a #${id} sync`;
  }

  remove(id: number) {
    return `This action removes a #${id} sync`;
  }
}
