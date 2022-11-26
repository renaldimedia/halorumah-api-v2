import { Module } from '@nestjs/common';
import { GlobalConfigService } from './global-config.service';
import { GlobalConfigController } from './global-config.controller';

@Module({
  controllers: [GlobalConfigController],
  providers: [GlobalConfigService]
})
export class GlobalConfigModule {}
