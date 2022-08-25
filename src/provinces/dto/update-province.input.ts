import { CreateProvinceInput } from './create-province.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProvinceInput extends PartialType(CreateProvinceInput) {
  @Field(() => Int)
  id: number;

  @Field(type => String, {nullable: true})
  province_code: string

  @Field({nullable: true})
  province_name: string

  @Field({nullable: true})
  country_id: number
}
