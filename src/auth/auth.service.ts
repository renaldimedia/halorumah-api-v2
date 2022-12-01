import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { MailService } from 'src/mail/mail.service';
import * as Str from '@supercharge/strings/dist';
import { GraphQLError } from 'graphql';
import { UpdateUserInput } from 'src/users/dto/update-user.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { GlobalMutationResponse } from 'src/formatResponse/global-mutation.response';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}
  

  async createResetPassword(email: string): Promise<any>{
    const usr = await this.usersService.findByEmail(email);
    if(usr == null || typeof usr == 'undefined'){
      throw new GraphQLError("User tidak terdaftar");
    }
    const actualDate = new Date();
    const dateToCheck = new Date(usr.last_reset_password);
    if(usr.reset_password_count > 1 && (dateToCheck.getDate() === actualDate.getDate() 
    && dateToCheck.getMonth() === actualDate.getMonth()
    && dateToCheck.getFullYear() === actualDate.getFullYear())){
      throw new GraphQLError("Anda terlalu banyak melakukan reset password! hubungi customer service kami untuk melakukan reset password!");
    }
    // if(usr)
    let code = Str.random(6);

    let usrobj = new UpdateUserInput();
    usrobj.reset_password_code = code;
    usrobj.last_reset_password = new Date();
    if(typeof usrobj.reset_password_count == 'undefined' || usrobj.reset_password_count == null){
      usrobj.reset_password_count = 1;
    }else{
      usrobj.reset_password_count = usrobj.reset_password_count + 1; 
    }
    const updated = await this.usersService.update(usrobj, usr.id);

    if(updated.id != null){
      this.mailService.sendPasswordReset(email, code);
    }

    return usr;
  }

  async resetPassword(payload: ResetPasswordInput){
    if((typeof payload.password != 'undefined' || payload.password != null) && payload.password !== payload.confirm_password){
      throw new GraphQLError("Pastikan anda mengisi password dan konfirmasi password dengan benar!");
    }
    let usr = await this.usersService.findOneBy({reset_password_code: payload.code});
    if(usr == null || typeof usr == 'undefined'){
      throw new GraphQLError("User tidak terdaftar");
    }
    if((typeof payload.password == 'undefined' || payload.password == null) && typeof usr['id'] != 'undefined'){
      const result = new GlobalMutationResponse();
      result.ok = true;
      result.message = "ok";
      return result;
    }else if((typeof payload.password == 'undefined' || payload.password == null) && typeof usr['id'] == 'undefined'){
      const result = new GlobalMutationResponse();
      result.ok = false;
      result.message = "code not found!";
      return result;
    }
    let usrobj = new UpdateUserInput();
    usrobj.reset_password_code = payload.code;
    const password = await bcrypt.hash(payload.password, 10);
    usrobj.password = password;
    const updated = await this.usersService.resetPassword(usrobj, usr.id);

    return updated;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneBy({email: email});
    // console.log(user);
    const valid = user && (await bcrypt.compare(password, user?.password));

    if (user && valid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginUserInput: LoginUserInput) {
    const user = await this.usersService.findOneBy({email: loginUserInput.email});
    const { password, ...result } = user;
    // console.log(user);
    return {
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        role: user.role,
      }),
      user: result,
    };
  }

  async signup(signupUserInput: CreateUserInput) {
    const user = await this.usersService.findOneBy({email: signupUserInput.email});

    if (user && user.id != null) {
      throw new Error('User already exists');
    }

    const password = await bcrypt.hash(signupUserInput.password, 10);
    const userr = await this.usersService.create({
      ...signupUserInput,
      password,
    });

    if(userr != null && typeof userr.id != 'undefined'){
      let code = Str.random(6);
      
      await this.mailService.sendUserConfirmation(userr, code);
    }

    return userr;
  }
}
