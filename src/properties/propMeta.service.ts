import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { PropertyMeta } from './entities/property-meta.entity';
import { Property } from './entities/property.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PropMetaService {
  constructor(@InjectDataSource() private datasource: DataSource) { }

  
}