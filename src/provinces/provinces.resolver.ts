import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Info } from '@nestjs/graphql';
import { ProvincesService } from './provinces.service';
import { Province } from './entities/province.entity';
import { CreateProvinceInput } from './dto/create-province.input';
import { UpdateProvinceInput } from './dto/update-province.input';
import { Country } from 'src/countries/entities/country.entity';
import { CountriesService } from 'src/countries/countries.service';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';

@Resolver(() => Province)
// @Injectable()
export class ProvincesResolver {
  constructor(private readonly provincesService: ProvincesService, private readonly countriesService: CountriesService) { }

  @Mutation(() => Province)
  createProvince(@Args('createProvinceInput') createProvinceInput: CreateProvinceInput) {
    return this.provincesService.create(createProvinceInput);
  }
  
  @Query(() => [Province], { name: 'provinces' })
  async findAll(@Args('keyword', {nullable: true}) keyword: string = null, @Args('country_id', {nullable: true}) country_id: number = null, @Info() info) {
    // const fields = info.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
    return this.provincesService.findAll(keyword, country_id);
  }

  @Query(() => Province, { name: 'province' })
  findOne(@Args('id', { type: () => Int }) id: number, @Info() info) {
    // const fields = info.fieldNodes[0].selectionSet.selections.map(item => item.name.value);

    return this.provincesService.findOne(id);
  }

  @Mutation(() => GlobalMutationResponse)
  updateProvince(@Args('updateProvinceInput') updateProvinceInput: UpdateProvinceInput) {
    return this.provincesService.update(updateProvinceInput.id, updateProvinceInput);
  }

  @Mutation(() => GlobalMutationResponse)
  removeProvince(@Args('id', { type: () => Int }) id: number) {
    return this.provincesService.remove(id);
  }
}
