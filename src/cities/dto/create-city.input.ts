import { InputType, Field } from '@nestjs/graphql';
import { CreateSubdistrictInput } from 'src/subdistricts/dto/create-subdistrict.input';

@InputType()
export class CreateCityInput {

  @Field({nullable: true})
  id: number
 
  @Field({nullable: true})
  city_code: string
 
  @Field()
  city_name: string

  @Field({nullable: true})
  province_id: number

  @Field(() => [CreateSubdistrictInput],{nullable: true})
  subdistricts: CreateSubdistrictInput[];
}
