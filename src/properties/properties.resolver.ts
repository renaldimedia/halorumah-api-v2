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
import { ProvincesService } from 'src/provinces/provinces.service';
import { CitiesService } from 'src/cities/cities.service';
import { SubdistrictsService } from 'src/subdistricts/subdistricts.service';
import { Province } from 'src/provinces/entities/province.entity';
import { City } from 'src/cities/entities/city.entity';
import { Subdistrict } from 'src/subdistricts/entities/subdistrict.entity';
import { PropertyMetaMaster, PropertyMetaMasterInput } from './entities/property-meta-master.entity';
import { PropertyMetaResponse } from './entities/property-meta.entity';

@Resolver(() => Property)
export class PropertiesResolver {
  constructor(private readonly propertiesService: PropertiesService, private readonly fileService: FilesService, private readonly countryService: CountriesService, private readonly provincesService: ProvincesService, private readonly citiesService: CitiesService, private readonly subdistrictsService: SubdistrictsService) {}

  @Mutation(() => Property)
  @UseGuards(JwtAuthGuard)
  createProperty(@Args('createPropertyInput') createPropertyInput: CreatePropertyInput, @CurrentUser() user: any) {
    // console.log(user);
    return this.propertiesService.create(createPropertyInput, user.userId);
  }

  @Mutation(() => PropertyMetaMaster)
  @UseGuards(JwtAuthGuard)
  createPropertyMeta(@Args('propertyMaster') createPropertyInput: PropertyMetaMasterInput) {
    // console.log(user);
    return this.propertiesService.createMeta(createPropertyInput);
  }

  @ResolveField(() => Country)
  country(@Parent() prop: Property): Promise<Country>{
    return this.countryService.findOne(prop.country);
  }
  @ResolveField(() => Province)
  province(@Parent() prop: Property): Promise<Province>{
    return this.provincesService.findOne(prop.province);
  }
  @ResolveField(() => City)
  city(@Parent() prop: Property): Promise<City>{
    return this.citiesService.findOne(prop.city);
  }
  @ResolveField(() => Subdistrict)
  subdistrict(@Parent() prop: Property): Promise<Subdistrict>{
    return this.subdistrictsService.findOne(prop.subdistrict);
  }
  // @ResolveField(() => File)
  // property_featured_image(@Parent() prop: Property): Promise<File>{
  //   return this.fileService.findOne(prop.property_featured_image);
  // }

  @ResolveField(() => [File])
  property_list_images_file(@Parent() prop: Property): Promise<File[]>{
    return this.fileService.findFileList(prop.property_list_images);
  }
  @ResolveField(() => [PropertyMetaResponse], {name: 'metas'})
  metas(@Parent() prop: Property): Promise<PropertyMetaResponse[]>{
    console.log('metas')
    return this.propertiesService.findAllMeta(prop.id);
  }

  @Query(() => [PropertyResponse], { name: 'properties' })
  findAll(@Args('option', {nullable: true}) opt:MetaQuery = null, @Info() inf: any) {
    const fields = inf.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
    return this.propertiesService.findAll(opt,fields);
  }

  @Query(() => PropertyResponse, { name: 'property' })
  findOne(@Args('id', { type: () => Int }) id: number, @Info() inf: any) {
    const fields = inf.fieldNodes[0].selectionSet.selections.map(item => item.name.value);

    return this.propertiesService.findOne(id,fields);
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
