// import { ObjectType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
import { BaseEntity } from "typeorm";

// @ObjectType()
export class MailUser extends BaseEntity{
    @IsEmail()
    email: string;

    name: string;

    phone?:string;

    
}