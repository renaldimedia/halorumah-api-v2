import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sync } from './entities/sync.entity';

@Module({
  controllers: [SyncController],
  providers: [SyncService],
  imports: [TypeOrmModule.forFeature([Sync])]
})
export class SyncModule {}
