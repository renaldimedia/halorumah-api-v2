import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserPackageInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
