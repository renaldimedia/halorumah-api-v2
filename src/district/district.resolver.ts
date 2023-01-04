import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DistrictService } from './district.service';
import { District } from './entities/district.entity';
import { CreateDistrictInput } from './dto/create-district.input';

@Resolver(() => District)
export class DistrictResolver {
  constructor(private readonly districtsService: DistrictService) {}

  @Mutation(() => District)
  createDistrict(@Args('createDistrictInput') createDistrictInput: CreateDistrictInput) {
    return this.districtsService.create(createDistrictInput);
  }


  @Query(() => [District], { name: 'districts' })
  findAll(@Args('city_id', {nullable: true}) groupid: number, @Args('keyword', {nullable: true}) keyword: string) {
    return this.districtsService.findAll(groupid,keyword);
  }

  @Query(() => District, { name: 'district' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.districtsService.findOne(id);
  }
}
