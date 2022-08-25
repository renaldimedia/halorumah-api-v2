import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator';
import { CreateUserProfileInput } from './create-user-profile.input';

@InputType()
export class UpdateUserInput {
  @Field({nullable: true})
  id: string

  @Field({nullable: true})
  @IsOptional()
  @IsEmail()
  email: string;

  @Field({nullable: true})
  @IsOptional()
  @IsMobilePhone('id-ID')
  phone: string;

  @Field({nullable: true})
  @IsOptional()
  password: string;

  @Field({nullable: true})
  @IsOptional()
  confirm_password: string;

 
  @Field({nullable: true})
  @IsOptional()
  role: string;


  @Field(type => String, {nullable: true})
  @IsOptional()
  resetpasswordkey: string

  
  @Field({nullable: true})
  @IsOptional()
  phone_confirmed_at: Date

  
  @Field({nullable: true})
  @IsOptional()
  email_confirmed_at: Date

  
  @Field({nullable: true})
  @IsOptional()
  device_id: string

  
  @Field({nullable: true})
  @IsOptional()
  notification_id: string

  
  @Field({nullable: true})
  @IsOptional()
  extra: string

  
  @Field({nullable: true})
  capabilities: string

  @Field(() => CreateUserProfileInput, {nullable: true})
  profile_info_: CreateUserProfileInput
}
