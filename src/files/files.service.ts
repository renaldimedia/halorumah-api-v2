import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateFileInput } from './dto/create-file.input';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {

  constructor(
    @InjectRepository(File) private filesRespository: Repository<File>, @InjectDataSource() private datasource: DataSource
  ) { }

  create(createFileInput: CreateFileInput) {
    const flc = this.filesRespository.create(createFileInput);
    return this.filesRespository.insert(flc);
  }

  async findFileList(list: string[], flat: boolean = false): Promise<any> {
    if (list.length == 0) {
      return [];
    }
    const result = [];
    for (let i = 0; i < list.length; i++) {
      const res = await this.findOne(list[i]);
      if (res != null) {
        if (flat) {
          result.push({ url: res['rendered_url'] });
        } else {
          result.push(res)
        }
      }
    }
    return result;
  }

  findAll(userid: string = null): Promise<File[]> {
    const py = {};

    if (userid != null) {
      py['where'] = [{ uploaded_by: userid }];
    }
    return this.filesRespository.find(py);
  }

  async findOne(id: string): Promise<File> {
    return await this.filesRespository.findOneBy({ id: id });
  }
}
