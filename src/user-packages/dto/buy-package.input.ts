import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator';

@InputType()
export class BuyPackageInput {
    @Field({ nullable: true, description: "user id" })
    id: string

    @Field(type => String, { nullable: true })
    package_code: string
    @Field({nullable: true})
    @IsOptional()
    @IsEmail()
    payment_user_email: string;
    @Field({nullable: true})
    @IsOptional()
    payment_user_phone: string;
    @Field({nullable: true})
    payment_user_name: string;

    @Field(() => String, { nullable: false })
    payment_type: string;

    /**
     * Take note: MANUAL, AUTO_TF, AUTO_EWALLET, AUTO_CARD
     */
    @Field(() => String, { nullable: false })
    payment_method: string;


    @Field({nullable: true, defaultValue:0})
    payment_total: number;
}
