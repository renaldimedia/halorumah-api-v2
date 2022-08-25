import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone } from 'class-validator';
import { Profile } from '../entities/profile.entity';
import { CreateUserProfileInput } from './create-user-profile.input';

@InputType()
export class CreateUserInput {
  @Field({nullable: true})
  id: string

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsMobilePhone('id-ID')
  phone: string;

  @Field()
  password: string;

  @Field()
  confirm_password: string;

  @Field(() => CreateUserProfileInput)
  profile_info_: CreateUserProfileInput

  @Field()
  role: string
}
