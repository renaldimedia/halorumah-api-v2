import { InputType, Int, Field } from '@nestjs/graphql';
import { CreateCityInput } from 'src/cities/dto/create-city.input';

@InputType()
export class CreateSubdistrictInput {

  @Field({nullable: true})
  id: number

  @Field({ nullable: true })
  subdistrict_code: string


  @Field()
  subdistrict_name: string

  @Field({ nullable: true })
  city_id: number
}
