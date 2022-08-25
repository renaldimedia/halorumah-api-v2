// import { CreateProvinceInput } from './create-province.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { SearchGlobInput } from 'src/dto/searchGlob.input';

@InputType()
export class SearchInput {
  @Field(type => String, {nullable: true})
  province_code: string

  @Field(type => String, {nullable: true})
  province_name: string

  @Field(type => Int,{nullable: true})
  country_id: number
}
