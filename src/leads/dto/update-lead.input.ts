import { CreateLeadInput } from './create-lead.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLeadInput extends PartialType(CreateLeadInput) {
  @Field(() => Int)
  id: number;
}
