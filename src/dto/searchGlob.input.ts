// import { CreateProvinceInput } from './create-province.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';

@InputType()
export class SearchGlobInput {
  @Field(type => String, {nullable: true})
  search_key: string

  @Field(type => String, {nullable: true})
  search_value: string

  /**
   * Field method, 1 => Fulltext search/LIKE 2 => Exact search
   */
  @Field({nullable: true})
  @IsIn([1, 2])
  method: number
}
