import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserPackagesService } from './user-packages.service';
import { UserPackage } from './entities/user-package.entity';
import { CreateUserPackageInput } from './dto/create-user-package.input';
import { UpdateUserPackageInput } from './dto/update-user-package.input';

@Resolver(() => UserPackage)
export class UserPackagesResolver {
  constructor(private readonly userPackagesService: UserPackagesService) {}

  @Mutation(() => UserPackage)
  createUserPackage(@Args('createUserPackageInput') createUserPackageInput: CreateUserPackageInput) {
    return this.userPackagesService.create(createUserPackageInput);
  }

  @Query(() => [UserPackage], { name: 'userPackages' })
  findAll() {
    return this.userPackagesService.findAll();
  }

  @Query(() => UserPackage, { name: 'userPackage' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userPackagesService.findOne(id);
  }

  @Mutation(() => UserPackage)
  updateUserPackage(@Args('updateUserPackageInput') updateUserPackageInput: UpdateUserPackageInput) {
    return this.userPackagesService.update(updateUserPackageInput.id, updateUserPackageInput);
  }

  @Mutation(() => UserPackage)
  removeUserPackage(@Args('id', { type: () => Int }) id: number) {
    return this.userPackagesService.remove(id);
  }
}
