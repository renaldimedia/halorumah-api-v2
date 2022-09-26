import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) { }

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    // console.log('login')
    return this.authService.login(loginUserInput);
  }

  @Mutation(() => User)
  signup(@Args('signupUserInput') signupUserInput: CreateUserInput) {
    console.log(signupUserInput);
    try {
      const { password, confirm_password } = signupUserInput;
      console.log(`${password} - ${confirm_password}`);
      if (password !== confirm_password) {
        throw new HttpException({
          message: "Confirm password harus sama!",
          status: HttpStatus.FORBIDDEN
        }, HttpStatus.FORBIDDEN);
      }
      return this.authService.signup(signupUserInput);
    } catch (error) {
      console.log(error)
      throw new HttpException({
        message: "Confirm password harus sama!",
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: JSON.stringify(error)
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
