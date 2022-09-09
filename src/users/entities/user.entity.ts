import { ObjectType, Field, Int } from '@nestjs/graphql';
import Role from 'src/enums/roles.enum';
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsInt, IsOptional, IsPhoneNumber, IsUUID } from 'class-validator';
import { capabilities_default } from 'src/enums/capabilities.enum';
import { Profile, ProfileResponse } from './profile.entity';
import * as bcrypt from 'bcrypt';
import { Subdistrict } from 'src/subdistricts/entities/subdistrict.entity';
import { Province } from 'src/provinces/entities/province.entity';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { File } from 'src/files/entities/file.entity';
import { Company, CompanyResponse } from './company.entity';

@Entity()
@Unique('user_unique',['email', 'phone'])
@ObjectType()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @IsEmail()
  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  @IsPhoneNumber('ID')
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    default: Role.DEFAULT,
  })
  @Field()
  role: string;

  @Column({type: 'uuid', nullable: true})
  @ManyToOne(() => Company)
  @JoinColumn()
  @Field(type => Company)
  company: string

  @Column({
    nullable: true
  })
  @Field(type => String, {nullable: true})
  resetpasswordkey: string

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  @Field()
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  @Field()
  public updated_at: Date;

  @Column({type: 'date', nullable: true})
  @Field()
  phone_confirmed_at: Date

  @Column({type: 'date', nullable: true})
  @Field()
  email_confirmed_at: Date

  @Column({type: 'varchar',length: 255, nullable: true})
  @Field()
  device_id: string

  @Column({type: 'varchar',length: 255, nullable: true})
  @Field()
  notification_id: string

  @Column({nullable: true, type: 'json'})
  @Field({nullable: true})
  extra: string

  @Column({nullable: true, type: 'text', default: JSON.stringify(capabilities_default)})
  capabilities: string

  @Field(type => [String], {nullable: true})
  @IsOptional()
  errors: string[]

  @Field({nullable: true})
  @IsOptional()
  messages: string

  @Column({nullable: true, type: 'uuid'})
  @Field({nullable: true})
  @ManyToOne(() => File, (file) => file.id)
  @JoinColumn()
  photo_profile: string

  @Field(type => File, {nullable: true})
  photo_profile_file: File

  @Column({nullable: true})
  @Field({nullable: true})
  display_name: string

  @Column({nullable: true})
  @Field({nullable: true})
  full_name: string
  
  @Column({nullable: true})
  @Field({nullable: true})
  account_whatsapp_number: string

  @Column({nullable: true})
  @Field({nullable: true})
  account_rumah123: string

  @Column({nullable: true})
  @Field({nullable: true})
  account_rumahcom: string

  @Column({nullable: true})
  @Field({nullable: true})
  account_olx: string

  @Column({nullable: true})
  @Field({nullable: true})
  account_lamudi: string

  @Column({nullable: true})
  @Field({nullable: true})
  account_discord: string

  @Column({nullable: true, type: 'int', default: 0})
  @Field({nullable: true})
  property_count: number

  @Column({nullable: true})
  @ManyToOne(() => Country, (country) => country.id)
  @Field(type => Country, {nullable: true})
  country: number

  @Column({nullable: true})
  @ManyToOne(() => Province, (province) => province.id)
  @Field(type => Province, {nullable: true})
  province: number

  @Column({nullable: true})
  @ManyToOne(() => City, (city) => city.id)
  @Field(type => City, {nullable: true})
  city: number

  @Column({nullable: true})
  @ManyToOne(() => Subdistrict, (subd) => subd.id)
  @Field(type => Subdistrict, {nullable: true})
  subdistrict: number
  
  @Column({nullable: true, type: 'text'})
  @Field(type => String, {nullable: true})
  full_address: string

  @Column({nullable: true, type: 'varchar', length: 30})
  @Field(type => String, {nullable: true})
  agent_id: string

  @Column({nullable: true, type: 'varchar', length: 30})
  @Field(type => String, {nullable: true})
  company_id: string

  @Field({nullable: true})
  whatsapp_link: string

  
  @Field({nullable: true})
  rumah123_link: string

  
  @Field({nullable: true})
  rumahcom_link: string

  
  @Field({nullable: true})
  olx_link: string

  
  @Field({nullable: true})
  lamudi_link: string

  
  @Field({nullable: true})
  discord_link: string
}

@ObjectType()
export class UsersResponse{
  @Field({nullable: true})
  id: string;

  @Field(type => CompanyResponse, {nullable: true})
  company: CompanyResponse

  @Field(type => File, {nullable: true})
  photo_profile_file: File

  @Field({nullable: true})
  email: string;

  @Field({nullable: true})
  phone: string;

  @Field({nullable: true})
  role: string; 

  @Field({nullable: true})
  extra: string

  @Field(type => [String], {nullable: true})
  @IsOptional()
  errors: string[]

  @Field({nullable: true})
  @IsOptional()
  messages: string

  @Field(type => File, {nullable: true})
  // @ManyToOne(() => File, (file) => file.id)
  photo_profile: File

  
  @Field({nullable: true})
  display_name: string

  
  @Field({nullable: true})
  full_name: string
  
  
  @Field({nullable: true})
  account_whatsapp_number: string

  
  @Field({nullable: true})
  account_rumah123: string

  
  @Field({nullable: true})
  account_rumahcom: string

  
  @Field({nullable: true})
  account_olx: string

  
  @Field({nullable: true})
  account_lamudi: string

  
  @Field({nullable: true})
  account_discord: string

  @Field({nullable: true})
  whatsapp_link: string

  
  @Field({nullable: true})
  rumah123_link: string

  
  @Field({nullable: true})
  rumahcom_link: string

  
  @Field({nullable: true})
  olx_link: string

  
  @Field({nullable: true})
  lamudi_link: string

  
  @Field({nullable: true})
  discord_link: string

  
  @Field({nullable: true})
  property_count: number

  
  @Field(type => Country, {nullable: true})
  country: Country

  @Field(type => Province, {nullable: true})
  // @ManyToOne(() => Province)
  province: Province

  @Field(type => Province, {nullable: true})
  province_resolve: Province
  

  @Field(type => City, {nullable: true})
  city: City

  @Field(type => Subdistrict, {nullable: true})
  subdistrict: Subdistrict
  

  @Field(type => String, {nullable: true})
  full_address: string

  @Field(type => String, {nullable: true})
  full_address_rendered: string
}
