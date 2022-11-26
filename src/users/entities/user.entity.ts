import { ObjectType, Field, Int } from '@nestjs/graphql';
import Role from 'src/enums/roles.enum';
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsInt, IsOptional, IsPhoneNumber, IsUUID } from 'class-validator';
import { capabilities_default } from 'src/enums/capabilities.enum';
import { Subdistrict } from 'src/subdistricts/entities/subdistrict.entity';
import { Province } from 'src/provinces/entities/province.entity';
import { City } from 'src/cities/entities/city.entity';
import { Country } from 'src/countries/entities/country.entity';
import { File } from 'src/files/entities/file.entity';
import { Company, CompanyResponse } from './company.entity';
import { UserPackages } from '../../user-packages/entities/user-packages.entity';
import { Package } from 'src/packages/entities/package.entity';

@Entity()
@Unique('user_unique',['email', 'phone', 'device_id', 'username'])
@ObjectType()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({nullable: true, type: 'text'})
  @Field({nullable: true})
  user_desc: string;

  @Column({type: 'int', nullable: true})
  @Field(type => Int, {nullable: true})
  old_id: number;
  
  @Column()
  @Field()
  @IsEmail()
  email: string;

  @Column({nullable: true})
  @Field({nullable: true})
  username: string;

  @Column({nullable: true})
  @Field({nullable: true})
  @IsPhoneNumber('ID')
  phone: string;

  @Column({nullable: true})
  @Field({nullable: true})
  // @IsPhoneNumber('ID')
  mobile: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    default: Role.DEFAULT,
  })
  @Field()
  role: string;

  // @Column({type: 'uuid', nullable: true})
  @ManyToOne(() => Company)
  @JoinColumn()
  @Field(type => Company)
  company: string

  @Column({nullable: true})
  @Field(type => String, {nullable: true})
  company_old: string

  @Column({
    nullable: true
  })
  @Field(type => String, {nullable: true})
  resetpasswordkey: string;

  @CreateDateColumn({ type: "date" })
  @Field()
  public registered_date: Date;

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

  // @Column({nullable: true, type: 'uuid'})
  @Field(type => File, {nullable: true})
  @ManyToOne(() => File, (file) => file.id)
  @JoinColumn()
  photo_profile: string

  @Column({type: 'text', nullable: true})
  @Field(type => String, {nullable: true})
  photo_profile_old: string

  // @Field(type => File, {nullable: true})
  // photo_profile_file: File

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

  // @Column({nullable: true})
  @ManyToOne(() => Country, (country) => country.id)
  @JoinColumn()
  @Field(type => Country, {nullable: true})
  country: number

  @Column({nullable: true})
  @Field(type => String, {nullable: true})
  country_text: string;

  // @Column({nullable: true})
  @ManyToOne(() => Province, (province) => province.id)
  @JoinColumn()
  @Field(type => Province, {nullable: true})
  province: number

  @Column({nullable: true})
  @Field(type => String, {nullable: true})
  province_text: string;

  // @Column({nullable: true})
  @ManyToOne(() => City, (city) => city.id)
  @JoinColumn()
  @Field(type => City, {nullable: true})
  city: number

  @Column({nullable: true})
  @Field(type => String, {nullable: true})
  city_text: string;

  // @Column({nullable: true})
  @ManyToOne(() => Subdistrict, (subd) => subd.id)
  @JoinColumn()
  @Field(type => Subdistrict, {nullable: true})
  subdistrict: number

  @Column({nullable: true})
  @Field(type => String, {nullable: true})
  subdistrict_text: string;
  
  @Column({nullable: true, type: 'text'})
  @Field(type => String, {nullable: true})
  full_address: string

  @Column({nullable: true, type: 'varchar', length: 30})
  @Field(type => String, {nullable: true})
  agent_id_old: string

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

  @OneToMany(type => UserPackages, (upk) => upk.user)
  @Field(() => [UserPackages], {nullable: true})
  userpackages: UserPackages[];

  @Field(type => Package, {nullable: true})
  package: Package

  @Field({nullable: true})
  title: string;
}

@ObjectType()
export class UsersResponse{
  @Field({nullable: true})
  id: string;

  @Field({nullable: true})
  username: string;

  @Field({nullable: true})
  password: string;

  @Field(type => CompanyResponse, {nullable: true})
  company: CompanyResponse

  @Field(type => File, {nullable: true})
  photo_profile_file: File

  // @Column({nullable: true, type: 'text'})
  @Field({nullable: true})
  user_desc: string;

  @Field({nullable: true})
  email: string;

  @Field({nullable: true})
  phone: string;

  @Field({nullable: true})
  // @IsPhoneNumber('ID')
  mobile: string;

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
  country_text: string

  @Field(type => String, {nullable: true})
  // @ManyToOne(() => Province)
  province_text: string
  

  @Field(type => String, {nullable: true})
  city_text: string

  @Field(type => String, {nullable: true})
  subdistrict_text: string
  

  @Field(type => String, {nullable: true})
  full_address: string

  @Field(type => String, {nullable: true})
  full_address_rendered: string

  @Field(type => String, {nullable: true})
  device_id: string

  @Field(type => String, {nullable: true})
  photo_profile_old: string

  @Field(type => Package, {nullable: true})
  package: Package

  @Field({nullable: true})
  title: string;
}
