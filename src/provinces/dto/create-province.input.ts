import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProvinceInput {
  @Field({nullable: true})
  id: number
  
  @Field(type => String, {nullable: true})
  province_code: string

  @Field()
  province_name: string

  @Field()
  country_id: number
}
