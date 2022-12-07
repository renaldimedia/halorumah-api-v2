import { InputType, Field } from '@nestjs/graphql';
import { CreateProvinceInput } from 'src/provinces/dto/create-province.input';

@InputType()
export class CreateLocationInput {
  @Field({nullable: true})
  id: number
  
  @Field(type => String, {nullable: true})
  country_code: string

  @Field()
  country_name: string

  @Field(() => [CreateProvinceInput],{nullable: true})
  province: CreateProvinceInput[];
}
