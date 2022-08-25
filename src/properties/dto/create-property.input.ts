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

  @Field(type => String, {nullable: false})
  property_title: string

  @Field(type => String, {nullable: false})
  property_desc: string

  @Field(type => Int)
  property_price: number

  @Field(type => Int, {nullable: true})
  property_price_second: number

  @Field(type => String, {nullable: false})
  property_type: string

  @Field(type => Float, {nullable: true})
  property_building_size: number

  @Field(type => Float, {nullable: true})
  property_land_size: number

  @Field(type => Int, {nullable: false})
  property_bathroom_count: number

  @Field(type => Int, {nullable: false})
  property_bedroom_count: number

  @Field(type => Int, {nullable: true, defaultValue: 0})
  property_garage_count: number

  @Field(type => String, {nullable: false})
  property_certificate_type: string


  @Field(type => String, {nullable: false})
  property_featured_image: string

  @Field(type => [String], {nullable: false})
  property_list_images: string[]

  @Field({nullable: true})
  country: number

  @Field({nullable: true})
  province: number

  @Field({nullable: true})
  city: number

  @Field({nullable: true})
  subdistrict: number

  @Field(type => String, {nullable: false})
  property_full_address: string

  @Field(type => String,{nullable: true})
  created_by_user: string

  @Field(type => String,{nullable: true})
  call_to_user: string

  @Field(type => Int)
  property_build_years: number

  @Field(type => String)
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
}




@InputType()
class PropertyMetaInput {
  @Field()
  property_constant_value: string

  @Field()
  master: string
}

@InputType()
export class CreatePropertyInput {
  @Field(type => PropertyInput)
  property: PropertyInput

  @Field(type => [PropertyMetaInput], {nullable: true})
  metas: PropertyMetaInput[]
}
