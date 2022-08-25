import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCityInput {

  @Field({nullable: true})
  id: number
 
  @Field({nullable: true})
  city_code: string

 
  @Field()
  city_name: string

  @Field()
  province_id: number
}
