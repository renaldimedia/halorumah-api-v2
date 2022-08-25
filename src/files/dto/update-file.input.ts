import { CreateFileInput } from './create-file.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateFileInput extends PartialType(CreateFileInput) {
  @Field(() => String)
  id: string;

  @Field({nullable: true})
  filename: string

  
  @Field({nullable: true})
  filepath: string

  
  @Field({nullable: true})
  mimetype: string

  
  @Field({nullable: true})
  @IsInt()
  size: number

  @Field({nullable: true})
  uniquekey: string


  @Field(type => String, {nullable: true})
  rendered_url: string
}
