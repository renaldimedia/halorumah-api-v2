// import { CreateCityInput } from './create-city.input';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCityInput {
  @Field(() => Int)
  id: number;

  @Field({nullable: true})
  city_code: string

 
  @Field({nullable: true})
  city_name: string

  @Field({nullable: true})
  province_id: number
}
