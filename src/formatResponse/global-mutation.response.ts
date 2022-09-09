import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Any } from 'typeorm';

@ObjectType()
export class GlobalMutationResponse {
  @Field({nullable: true})
  @IsOptional()
  affected: number;

  @Field(type => Boolean, {nullable: false, defaultValue: false})
  @IsOptional()
  ok: boolean;

  @Field(type => String, {nullable: true})
  @IsOptional()
  message: string

  @Field(type => [String], {nullable: true})
  @IsOptional()
  errors: string[]
}
