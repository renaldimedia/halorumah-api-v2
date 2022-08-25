import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSubdistrictInput {

  @Field({nullable: true})
  id: number

  @Field({ nullable: true })
  subdistrict_code: string


  @Field()
  subdistrict_name: string

  @Field({ nullable: false })
  city_id: number
}
