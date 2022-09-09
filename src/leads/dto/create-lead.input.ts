import { InputType, Int, Field } from '@nestjs/graphql';
import { IsJSON, IsOptional } from 'class-validator';

@InputType()
export class CreateLeadInput {
  @Field(type => String, {nullable: false, description: "Nama lengkap, required!"})
  full_name: string

  @Field(type => String, {nullable: false, description: "No Hp/Wa, required!"})
  phone: string

  @Field(type => String)
  email: string

  @Field(type => [CreateLeadExtraInput], {nullable: true, defaultValue: []})
  extra: CreateLeadExtraInput[]

  @Field(type => String)
  lead_type: string

  @Field(type => String, {nullable: true})
  source_url: string

  @Field(type => String, {nullable: true})
  lead_object_id: string

  @Field(type => String, {nullable: true})
  user: string
}

@InputType()
export class CreateLeadExtraInput{
  @Field(type => String)
  key: string

  @Field(type => String)
  value: string
}
