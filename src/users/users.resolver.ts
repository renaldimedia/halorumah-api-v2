import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User, UsersResponse } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import Role from 'src/enums/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { UpdateUserInput } from './dto/update-user.input';
import { ProvincesService } from 'src/provinces/provinces.service';
import { Province } from 'src/provinces/entities/province.entity';
import { Country } from 'src/countries/entities/country.entity';
import { FilesService } from 'src/files/files.service';
import { CitiesService } from 'src/cities/cities.service';
import { CountriesService } from 'src/countries/countries.service';
import { SubdistrictsService } from 'src/subdistricts/subdistricts.service';
import { CompanyResponse } from './entities/company.entity';
import { CompanyInput } from './dto/company.input';

@Resolver(() => UsersResponse)
export class UsersResolver {
  constructor(private readonly usersService: UsersService, private readonly fileService: FilesService, private readonly subdistrictsService: SubdistrictsService, private readonly countryService: CountriesService, private readonly provincesService: ProvincesService, private readonly citiesService: CitiesService) { }

  @Query(() => UsersResponse, { name: 'profile' })
  @UseGuards(JwtAuthGuard)
  myProfile(@CurrentUser() user: any): Promise<UsersResponse> {
    // console.log(user)
    return this.usersService.findById(user.userId);
  }

  @Query(() => UsersResponse, { name: 'userdetail' })
  userdetail(@Args('userid') userid: string): Promise<UsersResponse> {
    // console.log(user)
    return this.usersService.findById(userid, true);
  }

  // @ResolveField(() => Province, { name: 'province' })
  // async province(@Parent() user: User): Promise<Province> {
  //   // console.log('xx')
  //   return await this.provincesService.findOne(user.province);
  // }

  // @ResolveField(() => Country, { name: 'province' })
  // country(@Parent() user: User) {
  //   // console.log('xx')
  //   return this.countryService.findOne(user.country);
  // }

  @ResolveField(() => String)
  whatsapp_link(@Parent() user: User) {
    console.log('whatsapp link')
    return user.account_whatsapp_number != null ? `https://wa.me/${user.account_whatsapp_number}` : "";
  }

  @Mutation(() => User, { name: 'profile' })
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(@Args('profileData') profileData: UpdateUserInput, @CurrentUser() user: any) {
    return this.usersService.update(profileData, user.userId);
  }

  @Mutation(() => UsersResponse, { name: 'updateUser' })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(Role.ADMIN)
  async updateUser(@Args('profileData') profileData: UpdateUserInput, @CurrentUser() user: any) {
    return this.usersService.update(profileData, user.userId);
  }
  // Example of a query that requires a JWT token and a role of ADMIN
  @Query(() => [UsersResponse], { name: 'users' })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(Role.ADMIN)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => UsersResponse, { name: 'userByEmail' })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(Role.ADMIN)
  findByEmail(@Args('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @Query(() => UsersResponse, { name: 'user' })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(Role.ADMIN)
  findOne(@Args('userid') userid: string): Promise<UsersResponse> {
    return this.usersService.findById(userid);
  }

  @Query(() => [UsersResponse], { name: 'agents' })
  findAgents(): Promise<UsersResponse[]> {
    return this.usersService.findByRole('AGENT');
  }

  @Query(() => [UsersResponse], { name: 'members' })
  findByRole(@Args('role') role: string): Promise<UsersResponse[]> {
    return this.usersService.findByRole(role);
  }

  @Mutation(() => User, { name: 'createUser' })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(Role.ADMIN)
  create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => CompanyResponse, { name: 'company' })
  @UseGuards(JwtAuthGuard)
  createCompany(
    @Args('companyInput') companyInput: CompanyInput,
  ): Promise<CompanyResponse> {
    return this.usersService.createCompany(companyInput);
  }

  @Mutation(() => User, { name: 'deleteUser' })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles(Role.ADMIN)
  delete(@Args('userid') userid: string) {
    return this.usersService.delete(userid);
  }
}
