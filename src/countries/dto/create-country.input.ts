import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCountryInput {
  @Field({nullable: true})
  id: number
  
  @Field(type => String, {nullable: true})
  country_code: string

  @Field()
  country_name: string
}
