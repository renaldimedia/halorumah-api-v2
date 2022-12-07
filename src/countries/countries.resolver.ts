import { Resolver, Query, Mutation, Args, Int, Info } from '@nestjs/graphql';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import Role from 'src/enums/roles.enum';

@Resolver(() => Country)
export class CountriesResolver {
  constructor(private readonly countriesService: CountriesService) {}

  @Mutation(() => Country)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  createCountry(@Args('createCountryInput') createCountryInput: CreateCountryInput) {
    return this.countriesService.create(createCountryInput);
  }

  @Query(() => [Country], { name: 'countries' })
  findAll(@Args('keyword', {nullable: true}) keyword: string = null, @Info() info) {
    // const fields = info.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
    return this.countriesService.findAll(keyword);
  }

  @Query(() => Country, { name: 'country' })
  findOne(@Args('id', { type: () => Int }) id: number, @Info() info) {
    // const fields = info.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
    return this.countriesService.findOne(id);
  }

  @Mutation(() => Country)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateCountry(@Args('updateCountryInput') updateCountryInput: UpdateCountryInput) {
    return this.countriesService.update(updateCountryInput.id, updateCountryInput);
  }

  @Mutation(() => Country)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  removeCountry(@Args('id', { type: () => Int }) id: number) {
    return this.countriesService.remove(id);
  }
}
