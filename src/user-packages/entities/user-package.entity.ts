import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserPackage {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
