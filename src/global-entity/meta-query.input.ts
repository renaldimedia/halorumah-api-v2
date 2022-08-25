import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';
import { IsArray, IsDateString, IsOptional } from 'class-validator';

@InputType()
export class MetaQuery {

  @Field(type => [String], {nullable: true})
  @IsOptional()
  @IsArray()
  fields: string[];

  @Field(type => [OrderByQuery], {nullable: true})
  @IsOptional()
  sortBy: OrderByQuery[];

  // Limit
  @Field(type => Int, {nullable: true, defaultValue: 10})
  @IsOptional()
  take: number

  // Offset
  @Field(type => Int, {nullable: true,defaultValue: 1})
  @IsOptional()
  page: number

  // get data from-to spesific date
  @Field(type => String, {nullable: true})
  @IsOptional()
  @IsDateString()
  from: Date

  @Field(type => String, {nullable: true})
  @IsOptional()
  @IsDateString()
  to: Date
  // -------------------------------

  @Field(type => [WhereQuery], {nullable: true})
  where: WhereQuery[]

  @Field(type => Boolean, {nullable: true, defaultValue: true})
  relations: boolean
}

@InputType()
class RelationQuery{
  @Field(type => [String])
  entities: string[]

  @Field(type => [String])
  fields: string[]
}

@InputType()
class WhereQuery{
  @Field({nullable: false})
  key: string

  @Field({nullable: false})
  value: string

  @Field({nullable: true})
  nextOperator: string

  @Field({nullable: true})
  operator: string
}

@InputType()
class OrderByQuery{
  @Field({nullable: false})
  key: string

  @Field(type => Boolean, {nullable: true})
  isAsc: boolean
}