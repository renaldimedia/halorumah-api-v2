import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SubdistrictsService } from './subdistricts.service';
import { Subdistrict } from './entities/subdistrict.entity';
import { CreateSubdistrictInput } from './dto/create-subdistrict.input';
import { UpdateSubdistrictInput } from './dto/update-subdistrict.input';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';

@Resolver(() => Subdistrict)
export class SubdistrictsResolver {
  constructor(private readonly subdistrictsService: SubdistrictsService) {}

  @Mutation(() => Subdistrict)
  createSubdistrict(@Args('createSubdistrictInput') createSubdistrictInput: CreateSubdistrictInput) {
    return this.subdistrictsService.create(createSubdistrictInput);
  }


  @Query(() => [Subdistrict], { name: 'subdistricts' })
  findAll(@Args('city_id', {nullable: true}) groupid: number, @Args('keyword', {nullable: true}) keyword: string) {
    return this.subdistrictsService.findAll(groupid,keyword);
  }

  @Query(() => Subdistrict, { name: 'subdistrict' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.subdistrictsService.findOne(id);
  }

  @Mutation(() => GlobalMutationResponse)
  updateSubdistrict(@Args('updateSubdistrictInput') updateSubdistrictInput: UpdateSubdistrictInput) {
    return this.subdistrictsService.update(updateSubdistrictInput.id, updateSubdistrictInput);
  }

  @Mutation(() => GlobalMutationResponse)
  removeSubdistrict(@Args('id', { type: () => Int }) id: number) {
    return this.subdistrictsService.remove(id);
  }
}
