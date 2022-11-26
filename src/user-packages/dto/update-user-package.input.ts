import { CreateUserPackageInput } from './create-user-package.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserPackageInput extends PartialType(CreateUserPackageInput) {
  @Field(() => Int)
  id: number;
}
