import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePropertyLikeInput {
  @Field(type => Int)
  property: number
}
