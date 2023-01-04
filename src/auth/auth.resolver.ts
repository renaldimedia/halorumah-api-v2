import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import { ResetPasswordInput } from './dto/reset-password.input';
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
    // console.log(signupUserInput);
    try {
      const { password, confirm_password } = signupUserInput;
      console.log(`${password} - ${confirm_password}`);
      if (password !== confirm_password) {
        throw new HttpException({
          message: "Confirm password harus sama!",
          status: 400
        }, 400);
        return;
      }
      return this.authService.signup(signupUserInput);
    } catch (error) {
      console.log(error)
      throw new HttpException({
        message: "Confirm password harus sama!",
        status: 400,
        error: JSON.stringify(error)
      }, 400);
      return;
    }
  }

  @Mutation(() => User, {name: 'resetPasswordRequest'})
  async resetPasswordRequest(@Args('email') email: string){
    return await this.authService.createResetPassword(email);
  }

  // @Mutation(() => GlobalMutationResponse)
  // async checkCode(@Args('payload') payload: CheckCodeInput){
  //   return await this.authService.checkCode(payload);
  // }

  @Mutation(() => GlobalMutationResponse)
  async resetPassword(@Args('payload') payload: ResetPasswordInput){
    return await this.authService.resetPassword(payload);
  }
}
