import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesResolver } from './packages.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { PackageFeature } from './entities/package-feature.entity';
import { PackageFeatures } from './entities/package-features.entity';

@Module({
  providers: [PackagesResolver, PackagesService],
  imports: [TypeOrmModule.forFeature([Package, PackageFeature, PackageFeatures])]
})
export class PackagesModule {}
