import { InputType, Int, Field } from '@nestjs/graphql';
import { CreateCityInput } from 'src/cities/dto/create-city.input';

@InputType()
export class CreateProvinceInput {
  @Field({nullable: true})
  id: number
  
  @Field(type => String, {nullable: true})
  province_code: string

  @Field()
  province_name: string

  @Field({nullable: true})
  country_id: number

  @Field(() => [CreateCityInput],{nullable: true})
  cities: CreateCityInput[];
}
