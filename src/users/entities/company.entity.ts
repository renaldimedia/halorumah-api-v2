import { Field, ObjectType } from "@nestjs/graphql";
import { City } from "src/cities/entities/city.entity";
import { Country } from "src/countries/entities/country.entity";
import { File } from "src/files/entities/file.entity";
import { Province } from "src/provinces/entities/province.entity";
import { Subdistrict } from "src/subdistricts/entities/subdistrict.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Company {
    @PrimaryGeneratedColumn("uuid")
    @Field()
    id: string;

    @Column({ type: 'varchar', length: 255 })
    @Field(type => String, { nullable: false })
    company_name: string

    @Column({ type: 'text' })
    @Field(type => String, { nullable: false })
    company_desc: string

    @Column({ type: 'uuid' })
    @OneToOne(() => File)
    @JoinColumn()
    @Field(type => File, { nullable: true })
    company_logo_id: string

    @Field(type => File, { nullable: true })
    company_logo: File

    @Column({ nullable: true })
    @Field({ nullable: true })
    account_whatsapp_number: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    account_rumah123: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    account_rumahcom: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    account_olx: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    account_lamudi: string

    @Column({ nullable: true })
    @Field({ nullable: true })
    account_discord: string

    @Column({ nullable: true, type: 'int', default: 0 })
    @Field({ nullable: true })
    property_count: number

    @Column({ nullable: true })
    @ManyToOne(() => Country, (country) => country.id)
    @Field(type => Country, { nullable: true })
    country_id: number

    @Column({ nullable: true })
    @ManyToOne(() => Province, (province) => province.id)
    @Field(type => Province, { nullable: true })
    province_id: number

    @Column({ nullable: true })
    @ManyToOne(() => City, (city) => city.id)
    @Field(type => City, { nullable: true })
    city_id: number

    @Column({ nullable: true })
    @ManyToOne(() => Subdistrict, (subd) => subd.id)
    @Field(type => Subdistrict, { nullable: true })
    subdistrict_id: number

    //   @Column({nullable: true})
    @ManyToOne(() => Country, (country) => country.id)
    @Field(type => Country, { nullable: true })
    country: Country

    //   @Column({nullable: true})
    @ManyToOne(() => Province, (province) => province.id)
    @Field(type => Province, { nullable: true })
    province: Province

    //   @Column({nullable: true})
    @ManyToOne(() => City, (city) => city.id)
    @Field(type => City, { nullable: true })
    city: City

    //   @Column({nullable: true})
    @ManyToOne(() => Subdistrict, (subd) => subd.id)
    @Field(type => Subdistrict, { nullable: true })
    subdistrict: Subdistrict

    @Column({nullable: true})
    @Field(type => String, { nullable: true })
    company_type: string


    @Column({ nullable: true, type: 'text' })
    @Field(type => String, { nullable: true })
    full_address: string

    @ManyToOne(() => User, (usr) => usr.id)
    @Field(() => User, {nullable: true})
    owner: User
}

@ObjectType()
export class CompanyResponse {
    @Field({ nullable: true })
    id: string;

    // @Column({type: 'varchar', length: 255})
    @Field(type => String, { nullable: true })
    company_name: string

    // @Column({type: 'text'})
    @Field(type => String, { nullable: false })
    company_desc: string

    @Field(type => String, { nullable: true })
    company_logo_id: string

    @Field(type => File, { nullable: true })
    company_logo: File

    @Field(type => String, { nullable: true })
    company_type: string

    @ManyToOne(() => Country, (country) => country.id)
    @Field(type => Country, { nullable: true })
    country: Country

    //   @Column({nullable: true})
    // @ManyToOne(() => Province, (province) => province.id)
    @Field(type => Province, { nullable: true })
    province: Province

    //   @Column({nullable: true})
    // @ManyToOne(() => City, (city) => city.id)
    @Field(type => City, { nullable: true })
    city: City

    //   @Column({nullable: true})
    // @ManyToOne(() => Subdistrict, (subd) => subd.id)
    @Field(type => Subdistrict, { nullable: true })
    subdistrict: Subdistrict


    // @Column({ nullable: true, type: 'text' })
    @Field(type => String, { nullable: true })
    full_address: string

    // @Column({ nullable: true })
    @Field({ nullable: true })
    account_whatsapp_number: string

    // @Column({ nullable: true })
    @Field({ nullable: true })
    account_rumah123: string

    // @Column({ nullable: true })
    @Field({ nullable: true })
    account_rumahcom: string

    // @Column({ nullable: true })
    @Field({ nullable: true })
    account_olx: string

    // @Column({ nullable: true })
    @Field({ nullable: true })
    account_lamudi: string

    // @Column({ nullable: true })
    @Field({ nullable: true })
    account_discord: string

    // @Column({ nullable: true, type: 'int', default: 0 })
    @Field({ nullable: true })
    property_count: number

    @Field(() => User, {nullable: true})
    owner: User
}