import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone, IsOptional, IsPhoneNumber } from 'class-validator';
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

  @Field({nullable: true})
  photo_profile: string

  
  @Field({nullable: true})
  display_name: string

  
  @Field({nullable: true})
  full_name: string
  
  
  @Field({nullable: true})
  @IsOptional()
  @IsPhoneNumber('ID')
  account_whatsapp_number: string

  
  @Field({nullable: true})
  account_rumah123: string

  
  @Field({nullable: true})
  account_rumahcom: string

  
  @Field({nullable: true})
  account_olx: string

  
  @Field({nullable: true})
  account_lamudi: string

  
  @Field({nullable: true})
  account_discord: string

  
  @Field({nullable: true})
  property_count: number

  
  @Field({nullable: true})
  country: number

  
  @Field({nullable: true})
  province: number

  
  @Field({nullable: true})
  city: number

  
  @Field({nullable: true})
  subdistrict: number

  
  @Field(type => String, {nullable: true})
  full_address: string

  
  @Field(type => String, {nullable: true})
  agent_id: string
}
