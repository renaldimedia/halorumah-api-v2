import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import propAgeConstants from 'src/enums/propAgeConstans.enum';
import propPurchaseStatus from 'src/enums/propPurchaseStatus.enum';
import purchaseTypes from 'src/enums/purchaseType.enum';
import saleTypes from 'src/enums/saleTypes.enum';


@InputType()
class UpdateProperty{
  @Field(type => String, {nullable: true})
  property_code: string

  @Field(type => String, {nullable: true})
  property_title: string

  @Field(type => String, {nullable: true})
  property_desc: string

  @Field(type => Int, {nullable: true})
  property_price: number

  @Field(type => Int, {nullable: true})
  property_price_second: number

  @Field(type => String, {nullable: true})
  property_type: string

  @Field(type => Float, {nullable: true})
  property_building_size: number

  @Field(type => Float, {nullable: true})
  property_land_size: number

  @Field(type => Int, {nullable: true})
  property_bathroom_count: number

  @Field(type => Int, {nullable: true})
  property_bedroom_count: number

  @Field(type => String, {nullable: true})
  property_certificate_type: string


  @Field(type => String, {nullable: true})
  property_featured_image: string

  @Field(type => [String], {nullable: true})
  property_list_images: string[]

  @Field({nullable: true})
  country: number

  @Field({nullable: true})
  province: number

  @Field({nullable: true})
  city: number

  @Field({nullable: true})
  subdistrict: number

  @Field(type => String, {nullable: true})
  property_full_address: string

  @Field(type => String,{nullable: true})
  created_by_user: string

  @Field(type => String,{nullable: true})
  call_to_user: string

  @Field(type => Int, {nullable: true})
  property_build_years: number

  @Field(type => String, {nullable: true})
  @IsIn(Object.values(propAgeConstants))
  property_condition: string

  @Field(type => String, {nullable: true, defaultValue: saleTypes.SALE})
  @IsIn(Object.values(saleTypes))
  sales_type: string;

  @Field(type => String, {nullable: true, defaultValue: propPurchaseStatus.SALE})
  @IsIn(Object.values(propPurchaseStatus))
  sales_status: string;

  // @Column({nullable: true})
  @Field(type => String, {nullable: true})
  property_electricy: string

  @Field(type => String, {nullable: true, defaultValue: purchaseTypes.ONCE})
  @IsIn(Object.values(purchaseTypes))
  purchase_type: string;

  @Field(type => Int, {nullable: true})
  property_floor_count: number
  
  @Field(type => Int, {nullable: true})
  property_garage_bike_volume: number

  @Field(type => Int, {nullable: true})
  property_garage_car_volume: number

  @Field(type => Boolean, {nullable: true, defaultValue: false})
  property_has_heater: boolean

  @Field(type => Boolean, {nullable: true, defaultValue: false})
  property_has_airconditioner: boolean

  @Field(type => Boolean, {nullable: true, defaultValue: false})
  property_has_garage: boolean
}

@InputType()
class PropertyMetaUpdate {
  @Field()
  property_constant_value: string

  @Field()
  master: string
}

@InputType()
export class UpdatePropertyInput {
  @Field(type => Int)
  id: number;
  
  @Field(type => UpdateProperty)
  property: UpdateProperty

  @Field(type => [PropertyMetaUpdate], {nullable: true})
  metas: PropertyMetaUpdate[]
}
