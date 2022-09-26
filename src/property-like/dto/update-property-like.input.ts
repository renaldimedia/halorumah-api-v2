import { CreatePropertyLikeInput } from './create-property-like.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePropertyLikeInput extends PartialType(CreatePropertyLikeInput) {
  @Field(() => Int)
  id: number;
}
