import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PackagesService } from './packages.service';
import { Package, PackageResponse } from './entities/package.entity';
import { CreatePackageInput, FeaturesInput, PackageFeatureInput } from './dto/create-package.input';
import { UpdatePackageInput } from './dto/update-package.input';
import { PackageFeatures } from './entities/package-features.entity';
import { PackageFeature, PackageFeatureResponse } from './entities/package-feature.entity';

@Resolver(() => Package)
export class PackagesResolver {
  constructor(private readonly packagesService: PackagesService) {}

  @Mutation(() => Package)
  async createPackage(@Args('createPackageInput') createPackageInput: CreatePackageInput) {
    return await this.packagesService.create(createPackageInput);
  }

  @Mutation(() => [PackageFeature], {name: 'createFeature'})
  async createFeature(@Args('createFeatureInput') createFeatureInput: FeaturesInput) {
    return await this.packagesService.createFeatures(createFeatureInput);
  }

  @Query(() => [PackageFeatureResponse], { name: 'packageFeatures' })
  async findAllFeature() {
    return await this.packagesService.findFeatures();
  }

  @Query(() => [PackageResponse], { name: 'packages' })
  async findAll() {
    const res = await this.packagesService.findAll();
    console.log(res);
    return res;
  }

  @Query(() => [PackageFeatures], { name: 'packagess' })
  findAllSub() {
    return this.packagesService.findAllSub();
  }

  @Query(() => Package, { name: 'package' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.packagesService.findOne(id);
  }

  @Mutation(() => Package)
  updatePackage(@Args('updatePackageInput') updatePackageInput: UpdatePackageInput) {
    return this.packagesService.update(updatePackageInput.id, updatePackageInput);
  }

  @Mutation(() => Package)
  removePackage(@Args('id', { type: () => Int }) id: number) {
    return this.packagesService.remove(id);
  }
}
