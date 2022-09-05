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

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService, private readonly provincesService: ProvincesService) {}

  @Query(() => UsersResponse, {name: 'profile'})
  myProfile(@CurrentUser() user: any): Promise<User>{
    // console.log(user)
    return this.usersService.findById(user.userId);
  }

  @ResolveField(() => Province, {name: 'province'})
  province(@Parent() user: User){
    // console.log('xx')
    return this.provincesService.findOne(user.province);
  }

  @ResolveField(() => String)
  whatsapp_link(@Parent() user:User){
    console.log('whatsapp link')
    return user.account_whatsapp_number != null ? `https://wa.me/${user.account_whatsapp_number}` : "";
  }

  @Mutation(() => User, {name: 'profile'})
  // @UseGuards(JwtAuthGuard)
  async updateMyProfile(@Args('profileData') profileData: UpdateUserInput, @CurrentUser() user: any){
    return this.usersService.update(profileData, user.userId);
  }

  @Mutation(() => UsersResponse, {name: 'updateUser'})
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateUser(@Args('profileData') profileData: UpdateUserInput, @CurrentUser() user: any){
    return this.usersService.update(profileData, user.userId);
  }
  // Example of a query that requires a JWT token and a role of ADMIN
  @Query(() => [UsersResponse], { name: 'users' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => UsersResponse, { name: 'userByEmail' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findByEmail(@Args('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @Query(() => UsersResponse, { name: 'user' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Args('userid') userid: string): Promise<User> {
    return this.usersService.findById(userid);
  }



  @Mutation(() => User, {name: 'createUser'})
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User, {name: 'deleteUser'})
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Args('userid') userid: string){
    return this.usersService.delete(userid);
  }
}
