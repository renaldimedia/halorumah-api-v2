import { Field, ObjectType } from "@nestjs/graphql";
import { PropertyMetaMaster } from "./property-meta-master.entity";
import { Property } from "./property.entity";

@ObjectType()
export class PropertyMetaResponse {
    @Field()
    id: number;
  
    @Field(type => Property)
    property: Property
  
    @Field(type => PropertyMetaMaster)
    master: PropertyMetaMaster
  }