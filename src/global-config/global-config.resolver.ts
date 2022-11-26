import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GlobalConfigService } from './global-config.service';
import { GlobalConfig } from './entities/global-config.entity';
import { CreateGlobalConfigInput } from './dto/create-global-config.input';
import { UpdateGlobalConfigInput } from './dto/update-global-config.input';

@Resolver(() => GlobalConfig)
export class GlobalConfigResolver {
  constructor(private readonly globalConfigService: GlobalConfigService) {}

  @Mutation(() => GlobalConfig)
  createGlobalConfig(@Args('createGlobalConfigInput') createGlobalConfigInput: CreateGlobalConfigInput) {
    return this.globalConfigService.create(createGlobalConfigInput);
  }

  @Query(() => [GlobalConfig], { name: 'globalConfig' })
  findAll() {
    return this.globalConfigService.findAll();
  }

  @Query(() => GlobalConfig, { name: 'globalConfig' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.globalConfigService.findOne(id);
  }

  @Mutation(() => GlobalConfig)
  updateGlobalConfig(@Args('updateGlobalConfigInput') updateGlobalConfigInput: UpdateGlobalConfigInput) {
    return this.globalConfigService.update(updateGlobalConfigInput.id, updateGlobalConfigInput);
  }

  @Mutation(() => GlobalConfig)
  removeGlobalConfig(@Args('id', { type: () => Int }) id: number) {
    return this.globalConfigService.remove(id);
  }
}
