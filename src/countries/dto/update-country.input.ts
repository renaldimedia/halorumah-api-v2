import { CreateCountryInput } from './create-country.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCountryInput extends PartialType(CreateCountryInput) {
  @Field(() => Int)
  id: number;
  
  @Field(type => String, {nullable: true})
  country_code: string

  @Field(type => String, {nullable: true})
  country_name: string
}
