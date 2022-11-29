import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PackageBanefit, PackageFeature } from "src/packages/entities/package-feature.entity";
import { Package } from "src/packages/entities/package.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
@ObjectType()
export class UserPackages extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @ManyToOne(type => Package, (pac) => pac.userpackages)
    @Field(type => Package)
    package: Package;

    @ManyToOne(type => User, (usr) => usr.userpackages)
    @Field(type => User)
    user: User;

    @CreateDateColumn({ type: "date" })
    @Field(type => Date)
    public registered_date: Date;

    @CreateDateColumn({ type: "date", nullable: true })
    @Field(type => Date, {nullable: true})
    public expired_date: Date;

    @Column({nullable: true, default: 0})
    @Field({defaultValue: 0, nullable: true})
    payment_status: number;

    @Column({nullable: true, default: 0, type: 'int'})
    @Field(() => Int, {nullable: true, defaultValue: 0})
    credit: number;

    @Column({nullable: true, default: 0, type: 'int'})
    @Field(() => Int, {nullable: true, defaultValue: 0})
    vnov_credit: number;

    @Column({nullable: true, default: 0, type: 'int'})
    @Field(() => Int, {nullable: true, defaultValue: 0})
    package_listings: number;

    @Column({nullable: true, default: 0, type: 'int'})
    @Field(() => Int, {nullable: true, defaultValue: 0})
    package_featured_listings: number;

    @Column({nullable: true, default: 0})
    @Field({defaultValue: 0, nullable: true})
    status: number;

    @Column({nullable: true, type: 'json'})
    @Field(type => PackageBanefit, {nullable: true})
    banefit: PackageBanefit;

    @Field(() => String, {nullable: true})
    invoice_url: string;
}

@Entity()
@ObjectType()
export class UserPackageBanefit {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @ManyToOne(type => UserPackages, (upc) => upc.id)
    @Field(() => UserPackages)
    userpackage: UserPackages;

    @ManyToOne(type => PackageFeature, (pf) => pf.id)
    @Field(() => PackageFeature)
    package_feature: PackageFeature;

    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    value_type: string;

    @Column({nullable: true, comment: "Value or Remaining Value"})
    @Field(() => String, {nullable: true, description: "Value or Remaining value"})
    value: string;

    @Column({nullable: true})
    value_each: string;
}