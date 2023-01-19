import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsJSON, IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class CreateLeadInput {
  @Field(type => String, {nullable: false, description: "Nama lengkap, required!"})
  @IsNotEmpty()
  full_name: string

  @Field(type => String, {nullable: false, description: "No Hp/Wa, required!"})
  @IsNotEmpty()
  phone: string

  @Field(type => String)
  @IsOptional()
  @IsEmail()
  email: string

  @Field(type => [CreateLeadExtraInput], {nullable: true, defaultValue: []})
  extra: CreateLeadExtraInput[]

  @Field(type => String)
  lead_type: string

  @Field(type => String, {nullable: true})
  source_url: string

  @Field(type => String, {nullable: true})
  lead_object_id: string
}

@InputType()
export class CreateLeadExtraInput{
  @Field(type => String)
  key: string

  @Field(type => String)
  value: string
}
