import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { File } from 'src/files/entities/file.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Province } from 'src/provinces/entities/province.entity';
import { City } from 'src/cities/entities/city.entity';
import { Subdistrict } from 'src/subdistricts/entities/subdistrict.entity';
import { User, UsersResponse } from 'src/users/entities/user.entity';
import { PropertyMeta } from './property-meta.entity';
import { IsIn, IsOptional } from 'class-validator';
import propAgeConstants from 'src/enums/propAgeConstans.enum';
import purchaseTypes from 'src/enums/purchaseType.enum';
import propPurchaseStatus from 'src/enums/propPurchaseStatus.enum';
import saleTypes from 'src/enums/saleTypes.enum';
import { PropertyMetaResponse } from './property-meta.entity';

@ObjectType()
export class PropertyResponse {
  @Field(() => Int)
  id: number;

  // Required fields
  
  
  @Field(type => String, {nullable: true})
  property_code: string

  
  
  @Field(type => String, {nullable: false})
  property_title: string

  
  @Field(type => String, {nullable: false})
  property_desc: string

  
  @Field(type => Int)
  property_price: number

  @Field(type => String, {nullable: true})
  property_price_rendered: string

  
  @Field(type => Int, {nullable: true})
  @IsOptional()
  property_price_second: number

  @Field(type => String, {nullable: true})
  property_price_second_rendered: string

  
  @Field(type => String, {nullable: false})
  property_type: string

  @Field(type => String, {nullable: false})
  property_type_rendered: string


  
  @Field()
  property_area_size: number;

  
  @Field()
  property_building_size: number;

  @Field({nullable: true})
  property_area_size_rendered: string;

  
  @Field({nullable: true})
  property_building_size_rendered: string;

  @Field(type => String, {nullable: true})
  full_address_rendered: string

  @Field({nullable: true})
  listing_type_rendered: string

  @Field(type => User, {nullable: true})
  agent_rendered: User

  
  @Field(type => Int, {nullable: false})
  property_bathroom_count: number

  
  @Field(type => Int, {nullable: false})
  property_bedroom_count: number

  @Field(type => Int, {nullable: true})
  property_floor_count: number
  
  @Field(type => Int, {nullable: true})
  property_garage_bike_volume: number

  @Field(type => Int, {nullable: true})
  property_garage_car_volume: number

  @Field(type => String, {nullable: true})
  property_electricy: string

  // @Column({nullable: true, default: false, type: 'boolean'})
  @Field(type => Boolean, {nullable: true, defaultValue: false})
  property_has_heater: boolean

  // @Column({nullable: true, default: false, type: 'boolean'})
  @Field(type => Boolean, {nullable: true, defaultValue: false})
  property_has_airconditioner: boolean


  // @Column({nullable: true, default: false, type: 'boolean'})
  @Field(type => Boolean, {nullable: true, defaultValue: false})
  property_has_garage: boolean

  @Field(type => String, {nullable: true, defaultValue: false})
  property_has_heater_rendered: string

  // @Column({nullable: true, default: false, type: 'boolean'})
  @Field(type => String, {nullable: true, defaultValue: false})
  property_has_airconditioner_rendered: string


  // @Column({nullable: true, default: false, type: 'boolean'})
  @Field(type => String, {nullable: true, defaultValue: false})
  property_has_garage_rendered: string

  
  @Field(type => String, {nullable: false})
  property_certificate_type: string

  
  // @ManyToOne(() => File)
  @Field(type => File, {nullable: false})
  property_featured_image: File

  @Field(type => String, {nullable: false})
  property_featured_image_url: string

  @Field(type => [String], {nullable: false})
  property_list_images: string[]

  @Field(type => [File], {nullable: false})
  property_list_images_url: File[]
  
  @Field(type => Country, {nullable: true})
  country: Country

  
  @Field(type => Province, {nullable: true})
  province: Province

  
  @Field(type => City, {nullable: true})
  city: City

  
  @Field(type => Subdistrict, {nullable: true})
  subdistrict: Subdistrict

  
  @Field(type => String, {nullable: false})
  property_full_address: string

  
  @Field(type => UsersResponse)
  created_by_user: UsersResponse

  
  @Field(type => UsersResponse)
  call_to_user: UsersResponse

  @Field(type => [PropertyMetaResponse], {nullable: true})
  metas: PropertyMetaResponse[]

  @Field(type => [PropertyMetaResponse], {nullable: true})
  features_extra: PropertyMetaResponse[]

  @Field()
  property_build_years: number


  @Field()
  property_condition: string

  @Field()
  total_views: number


  @Field()
  total_star: number

  @Field()
  total_leads: number


  @Field()
  total_messages: number

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field()
  deleted_at: Date;


  @Field()
  sales_type: string;

  @Field()
  sales_status: string;


  @Field({nullable: true})
  purchase_type: string;

  @Field({nullable: true})
  property_building_type: string;
}

@ObjectType()
export class PropertyPaginationResponse {
 @Field(type => [PropertyResponse])
 data: PropertyResponse[]

 @Field(type => Int)
 total: number

 @Field(type => Int, {defaultValue: 1})
 page: number
}

@ObjectType()
export class PropertyPaginationInfoResponse {
 @Field(type => Int)
 total: number

 @Field(type => Int, {defaultValue: 1})
 page: number

 @Field(type => Int, {nullable: true, defaultValue: 10})
 per_page: number

 @Field(type => Int, {nullable: true, defaultValue: 10})
 total_page: number
}

