import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone, IsOptional, IsPhoneNumber } from 'class-validator';
import { Profile } from '../entities/profile.entity';
import { CreateUserProfileInput } from './create-user-profile.input';

@InputType()
export class CreateUserInput {
  @Field({nullable: true})
  id: string

  @Field(type => String, {nullable: true})
  company_id: string

  @Field()
  @IsEmail()
  email: string;

  @Field(type => String, {nullable: true})
  device_id: string;

  @Field()
  @IsMobilePhone('id-ID')
  phone: string;

  @Field()
  password: string;

  @Field()
  confirm_password: string;

  @Field()
  role: string

  @Field({nullable: true})
  photo_profile: string

  
  @Field({nullable: true})
  display_name: string

  
  @Field({nullable: false})
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
