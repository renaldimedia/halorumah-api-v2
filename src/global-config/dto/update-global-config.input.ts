import { CreateGlobalConfigInput } from './create-global-config.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateGlobalConfigInput extends PartialType(CreateGlobalConfigInput) {
  @Field(() => Int)
  id: number;
}
