import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { File } from 'src/files/entities/file.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Province } from 'src/provinces/entities/province.entity';
import { City } from 'src/cities/entities/city.entity';
import { Subdistrict } from 'src/subdistricts/entities/subdistrict.entity';
import { User } from 'src/users/entities/user.entity';
import { PropertyMeta } from './property-meta.entity';
import { IsIn, IsOptional } from 'class-validator';
import propAgeConstants from 'src/enums/propAgeConstans.enum';
import purchaseTypes from 'src/enums/purchaseType.enum';
import propPurchaseStatus from 'src/enums/propPurchaseStatus.enum';
import saleTypes from 'src/enums/saleTypes.enum';
import { PropertyListImages } from './property-list-images.entity';
import { PropertyMetaResponse } from './propmeta.response';

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

  
  @Field(type => Int, {nullable: true})
  @IsOptional()
  property_price_second: number

  
  @Field(type => String, {nullable: false})
  property_type: string

  
  @Field()
  property_area_size: string;

  
  @Field()
  property_building_size: string;

  
  @Field(type => Int, {nullable: false})
  property_bathroom_count: number

  
  @Field(type => Int, {nullable: false})
  property_bedroom_count: number

  
  @Field(type => Int, {nullable: true, defaultValue: 0})
  property_garage_count: number

  
  @Field(type => String, {nullable: false})
  property_certificate_type: string

  
  // @ManyToOne(() => File)
  @Field(type => File, {nullable: false})
  property_featured_image: File

  // @Column()
  // @ManyToOne(() => File)
  // @Field({nullable: false})
  // resolve_property_featured_image: string
  @Field(type => [File], {nullable: false})
  list_images: File[]

  
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

  
  @Field(type => User)
  created_by_user: User

  
  @Field(type => User)
  call_to_user: User

  @Field(type => [PropertyMetaResponse], {nullable: true})
  metas: PropertyMetaResponse[]

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
}


