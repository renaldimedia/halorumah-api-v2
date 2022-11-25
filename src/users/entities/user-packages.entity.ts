import { Field, ObjectType } from "@nestjs/graphql";
import { PackageBanefit, PackageFeature } from "src/packages/entities/package-feature.entity";
import { Package } from "src/packages/entities/package.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
@ObjectType()
export class UserPackages {
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

    @Column({nullable: true, default: 0})
    @Field({defaultValue: 0, nullable: true})
    status: number;

    @Column({nullable: true, type: 'json'})
    @Field(type => PackageBanefit, {nullable: true})
    banefit: PackageBanefit;
}