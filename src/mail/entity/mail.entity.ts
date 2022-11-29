// import { ObjectType } from "@nestjs/graphql";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class MailDb extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column()
    @IsEmail()
    from_email: string;

    @Column()
    @IsEmail()
    to_email: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    subject: string;

    @Column({ nullable: true, type: 'varchar', default: "QUEUE" })
    @Field(() => String, { nullable: true })
    status: string;
}