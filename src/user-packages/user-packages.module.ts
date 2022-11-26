import { Module } from '@nestjs/common';
import { UserPackagesService } from './user-packages.service';
import { UserPackagesResolver } from './user-packages.resolver';

@Module({
  providers: [UserPackagesResolver, UserPackagesService]
})
export class UserPackagesModule {}
