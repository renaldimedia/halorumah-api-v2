import { InputType, Field } from '@nestjs/graphql';
import { bool } from 'aws-sdk/clients/signer';
import { IsEmail, IsMobilePhone, IsOptional, IsPhoneNumber } from 'class-validator';
import { type } from 'os';
import { PackageBanefitInput } from 'src/packages/dto/create-package.input';
import { PackageBanefit } from 'src/packages/entities/package-feature.entity';
import { Package } from 'src/packages/entities/package.entity';

@InputType()
export class CreateUserInput {
  @Field({nullable: true})
  id: string

  @Field({nullable: true})
  old_id: number

  @Field(type => String, {nullable: true})
  company_id: string;

  @Field(type => String, {nullable: true})
  user_desc: string

  @Field()
  @IsEmail()
  email: string;

  @Field({nullable: true})
  username: string;

  @Field(type => String, {nullable: true})
  device_id: string;

  @Field()
  // @IsMobilePhone('id-ID')
  phone: string;

  @Field()
  // @IsMobilePhone('id-ID')
  mobile: string;

  @Field({nullable: true})
  password: string;

  @Field({nullable: true})
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

  @Field(type => Date, {nullable: true})
  registered_date: Date
  
  @Field(type => String, {nullable: true})
  full_address: string

  @Field(type => String, {nullable: true})
  photo_profile_old: string

  @Field({nullable: true})
  city_text: string

  @Field({nullable: true})
  province_text: string

  @Field({nullable: true})
  country_text: string

  @Field({nullable: true})
  subdistrict_text: string
  
  @Field(type => String, {nullable: true})
  agent_id: string

  @Field(type => String, {nullable: true})
  agent_id_old: string

  @Field(type => String, {nullable: true})
  package_code: string

  @Field({nullable: true})
  package_status: number

  @Field(type => Date, {nullable: true})
  package_registered: Date

  @Field(type => PackageBanefitInput, {nullable: true})
  package_banefit: PackageBanefitInput

  @Field(type => String, {nullable: true})
  title: string

  @Field(type => Boolean, {nullable: true, defaultValue: false})
  plainpass: bool;
}
