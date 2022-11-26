import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class GlobalConfig {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
