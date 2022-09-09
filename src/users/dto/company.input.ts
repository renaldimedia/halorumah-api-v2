import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CompanyInput {
    // @Column({type: 'varchar', length: 255})
    @Field(type => String, {nullable: false})
    company_name: string

    // @Column({type: 'text'})
    @Field(type => String, {nullable: false})
    company_desc: string

    @Field(type => String, {nullable: true})
    company_logo_id: string
}