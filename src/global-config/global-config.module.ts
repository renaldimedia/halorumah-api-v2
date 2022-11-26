import { Module } from '@nestjs/common';
import { GlobalConfigService } from './global-config.service';
import { GlobalConfigResolver } from './global-config.resolver';

@Module({
  providers: [GlobalConfigResolver, GlobalConfigService]
})
export class GlobalConfigModule {}
