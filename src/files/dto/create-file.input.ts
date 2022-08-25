import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateFileInput {

  @Field({nullable: true})
  id: string
  
  @Field({nullable: true})
  filename: string

  
  @Field({nullable: true})
  filepath: string

  
  @Field({nullable: true})
  mimetype: string

  
  @Field({nullable: true})
  @IsOptional()
  @IsInt()
  size: number
  
  @Field({nullable: true})
  @IsOptional()
  @IsUUID()
  uploaded_by: string

  @Field({nullable: true})
  uniquekey: string


  @Field(type => String, {nullable: true})
  rendered_url: string
}
