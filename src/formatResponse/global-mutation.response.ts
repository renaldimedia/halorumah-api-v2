import { Field, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Any } from 'typeorm';

@ObjectType()
export class GlobalMutationResponse {
  @Field({nullable: true, defaultValue: 0})
  @IsOptional()
  affected: number;

  @Field(type => Boolean, {nullable: false, defaultValue: false})
  @IsOptional()
  ok: boolean;

  @Field(type => String, {nullable: true, defaultValue: ""})
  @IsOptional()
  message: string

  @Field(type => [String], {nullable: true, defaultValue: []})
  @IsOptional()
  errors: string[]
}
