import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Info } from '@nestjs/graphql';
import { PropertiesService } from './properties.service';
import { Property } from './entities/property.entity';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesService } from 'src/files/files.service';
import { PropertyResponse } from './entities/get-all-props.response';
import { File } from 'src/files/entities/file.entity';
import { MetaQuery } from 'src/global-entity/meta-query.input';
import { Country } from 'src/countries/entities/country.entity';
import { CountriesService } from 'src/countries/countries.service';

@Resolver(() => Property)
export class PropertiesResolver {
  constructor(private readonly propertiesService: PropertiesService, private readonly fileService: FilesService, private readonly countryService: CountriesService) {}

  @Mutation(() => Property)
  @UseGuards(JwtAuthGuard)
  createProperty(@Args('createPropertyInput') createPropertyInput: CreatePropertyInput, @CurrentUser() user: any) {
    // console.log(user);
    return this.propertiesService.create(createPropertyInput, user.userId);
  }

  // @ResolveField(() => File)
  // property_featured_image(@Parent() prop: Property): Promise<File>{
  //   return this.fileService.findOne(prop.property_featured_image);
  // }

  @ResolveField(() => Country)
  country(@Parent() prop: Property): Promise<Country>{
    return this.countryService.findOne(prop.country);
  }

  @Query(() => [PropertyResponse], { name: 'properties' })
  findAll(@Args('option', {nullable: true}) opt:MetaQuery = null, @Info() inf: any) {
    const fields = inf.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
    return this.propertiesService.findAll(opt,fields);
  }

  @Query(() => PropertyResponse, { name: 'property' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.propertiesService.findOne(id);
  }

  @Mutation(() => Property)
  updateProperty(@Args('updatePropertyInput') updatePropertyInput: UpdatePropertyInput) {
    return this.propertiesService.update(updatePropertyInput.id, updatePropertyInput);
  }

  @Mutation(() => Property)
  removeProperty(@Args('id', { type: () => Int }) id: number) {
    return this.propertiesService.remove(id);
  }
}
