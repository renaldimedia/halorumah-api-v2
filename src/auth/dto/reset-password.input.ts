import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field({nullable: true})
  code: string;

  @Field({nullable: true})
  password: string;

  @Field({nullable: true})
  confirm_password: string;
}
