import { InputType, Int, Field, Float, PartialType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import propAgeConstants from 'src/enums/propAgeConstans.enum';
import propPurchaseStatus from 'src/enums/propPurchaseStatus.enum';
import purchaseTypes from 'src/enums/purchaseType.enum';
import saleTypes from 'src/enums/saleTypes.enum';
import { CreatePropertyInput } from './create-property.input';


@InputType()
class UpdateProperty extends PartialType(CreatePropertyInput){}

@InputType()
class PropertyMetaUpdate {
  @Field()
  property_constant_value: string

  @Field()
  master: string
}

@InputType()
export class UpdatePropertyInput {
  @Field(type => Int)
  id: number;
  
  @Field(type => UpdateProperty)
  property: UpdateProperty

  @Field(type => [PropertyMetaUpdate], {nullable: true})
  metas: PropertyMetaUpdate[]
}
