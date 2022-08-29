import { ObjectType, Field, Int } from '@nestjs/graphql';
import Role from 'src/enums/roles.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsInt, IsPhoneNumber } from 'class-validator';
import { User } from './user.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Province } from 'src/provinces/entities/province.entity';
import { City } from 'src/cities/entities/city.entity';
import { Subdistrict } from 'src/subdistricts/entities/subdistrict.entity';
import { File } from 'src/files/entities/file.entity';

@ObjectType()
export class Profile {
  @Column({nullable: true})
  @Field({nullable: true})
  @OneToOne(() => File, (file) => file.id)
  photo_profile: string

  @Column({nullable: true})
  @Field({nullable: true})
  display_name: string

  @Column({nullable: true})
  @Field({nullable: true})
  full_name: string
  
  @Column({nullable: true})
  @Field({nullable: true})
  account_whatsapp_number: number

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
  @Field({nullable: true})
  @ManyToOne(() => Country, (country) => country.id)
  @JoinColumn()
  country: number

  @Column({nullable: true})
  @Field({nullable: true})
  @ManyToOne(() => Province, (province) => province.id)
  @JoinColumn()
  province: number

  @Field(type => Province, {nullable: true})
  province_resolve: Province

  @Column({nullable: true})
  @Field({nullable: true})
  @ManyToOne(() => City, (city) => city.id)
  @JoinColumn()
  city: number

  @Column({nullable: true})
  @Field({nullable: true})
  @ManyToOne(() => Subdistrict, (subd) => subd.id)
  @JoinColumn()
  subdistrict: number
  

  @Column({nullable: true, type: 'text'})
  @Field(type => String, {nullable: true})
  full_address: string

  @Column({nullable: true, type: 'varchar', length: 30})
  @Field(type => String, {nullable: true})
  agent_id: string
}
