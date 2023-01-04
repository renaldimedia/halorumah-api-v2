import { CreateDistrictInput } from './create-district.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDistrictInput extends PartialType(CreateDistrictInput) {
  @Field(() => Int)
  id: number;
}
