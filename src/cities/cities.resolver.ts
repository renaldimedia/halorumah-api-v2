import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Info } from '@nestjs/graphql';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';
import { CreateCityInput } from './dto/create-city.input';
import { UpdateCityInput } from './dto/update-city.input';
import { Province } from 'src/provinces/entities/province.entity';
import { ProvincesService } from 'src/provinces/provinces.service';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';

@Resolver(() => City)
export class CitiesResolver {
  constructor(private readonly citiesService: CitiesService, private readonly provincesService: ProvincesService) {}

  @Mutation(() => City)
  createCity(@Args('createCityInput') createCityInput: CreateCityInput) {
    return this.citiesService.create(createCityInput);
  }

  @ResolveField(() => Province)
  async province(@Parent() ctr: City, @Info() info) {
    const { province_id } = ctr;
    // const fields = info.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
    return this.provincesService.findOne(province_id);
  }

  @Query(() => [City], { name: 'cities' })
  findAll(@Args('province_id', {nullable: true}) province_id: number = null,@Args('keyword', {nullable: true}) keyword: string = null,@Info() info) {
    // const fields = info.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
    return this.citiesService.findAll(keyword,province_id);
  }

  @Query(() => City, { name: 'city' })
  findOne(@Args('id', { type: () => Int }) id: number, @Info() info) {
    // const fields = info.fieldNodes[0].selectionSet.selections.map(item => item.name.value);

    return this.citiesService.findOne(id);
  }

  @Mutation(() => GlobalMutationResponse)
  updateCity(@Args('updateCityInput') updateCityInput: UpdateCityInput) {
    return this.citiesService.update(updateCityInput.id, updateCityInput);
  }

  @Mutation(() => GlobalMutationResponse)
  removeCity(@Args('id', { type: () => Int }) id: number) {
    return this.citiesService.remove(id);
  }
}
