import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateDistrictInput {

  @Field({nullable: true})
  id: number

  @Field({ nullable: true })
  district_code: string


  @Field()
  district_name: string

  @Field({ nullable: true })
  city_id: number
}
