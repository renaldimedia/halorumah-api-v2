import { CreateSubdistrictInput } from './create-subdistrict.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubdistrictInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  subdistrict_code: string


  @Field({ nullable: true })
  subdistrict_name: string

  @Field({ nullable: true })
  city_id: number
}
