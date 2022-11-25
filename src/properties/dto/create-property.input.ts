import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import { CreateCityInput } from 'src/cities/dto/create-city.input';
import { CreateCountryInput } from 'src/countries/dto/create-country.input';
import propAgeConstants from 'src/enums/propAgeConstans.enum';
import propPurchaseStatus from 'src/enums/propPurchaseStatus.enum';
import purchaseTypes from 'src/enums/purchaseType.enum';
import saleTypes from 'src/enums/saleTypes.enum';
import Decimal from 'decimal.js';


@InputType()
class PropertyInput{
  @Field(type => String, {nullable: true})
  property_code: string

  // @Column({nullable: true})
  @Field(() => Int, {nullable: true})
  old_id: number;

  @Field(type => String, {nullable: false})
  property_title: string

  @Field(type => String, {nullable: false})
  property_desc: string

  // @Column({nullable: true})
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

  @Field(type => String)
  property_price: number

  @Field(type => String, {nullable: true})
  property_price_second: number

  @Field(type => String, {nullable: false})
  property_type: string

  @Field(type => Float, {nullable: true})
  property_building_size: number

  @Field(type => Float, {nullable: true})
  property_land_size: number

  @Field(type => Int, {nullable: true, defaultValue: 0})
  property_bathroom_count: number

  @Field(type => Int, {nullable: true, defaultValue: 0})
  property_bedroom_count: number

  @Field(type => String, {nullable: true})
  property_certificate_type: string


  @Field(type => String, {nullable: true})
  property_featured_image: string

  @Field(type => [String], {nullable: true})
  property_list_images: string[]

  // @Column({nullable: true})
  @Field({nullable:true})
  property_featured_image_rendered: string

  // @Column({type: 'json', nullable: true})
  @Field(type => [String], {nullable: true})
  property_list_images_rendered: string[]

  @Field({nullable: true})
  country: number

  @Field({nullable: true})
  province: number

  @Field({nullable: true})
  city: number

  @Field({nullable: true})
  subdistrict: number

  @Field({nullable: true})
  country_text: string

  @Field({nullable: true})
  province_text: string

  @Field({nullable: true})
  city_text: string

  @Field({nullable: true})
  subdistrict_text: string

  @Field({nullable: true})
  created_at: string

  @Field(type => String, {nullable: false})
  property_full_address: string

  @Field(type => String,{nullable: true})
  created_by_user: string

  @Field(type => String,{nullable: true})
  call_to_user: string

  @Field(type => Int,{nullable: true})
  created_by_user_old: number

  @Field(type => Int,{nullable: true})
  call_to_user_old: number

  @Field(type => Int, {nullable: true})
  property_build_years: number

  // @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, nullable: true })
  @Field()
  property_area_size: number;

  // @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, nullable: true })
  // @Field()
  // property_building_size: number;

  @Field(type => String, {nullable: true})
  @IsIn(Object.values(propAgeConstants))
  property_condition: string

  @Field(type => String, {nullable: true, defaultValue: saleTypes.SALE})
  @IsIn(Object.values(saleTypes))
  sales_type: string;

  @Field(type => String, {nullable: true, defaultValue: propPurchaseStatus.SALE})
  @IsIn(Object.values(propPurchaseStatus))
  sales_status: string;

  @Field(type => String, {nullable: true, defaultValue: purchaseTypes.ONCE})
  @IsIn(Object.values(purchaseTypes))
  purchase_type: string;

  @Field(type => Int, {nullable: true})
  total_views: number;
}




@InputType()
class PropertyMetaInput {
  @Field(type => String)
  property_constant_value: string

  @Field(type => String)
  master: string
}

@InputType()
export class CreatePropertyInput {
  @Field(type => PropertyInput)
  property: PropertyInput

  @Field(type => [PropertyMetaInput], {nullable: true})
  metas: PropertyMetaInput[]

  @Field(type => String, {nullable: true})
  callback: string;
}
