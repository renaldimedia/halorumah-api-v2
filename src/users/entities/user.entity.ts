import { ObjectType, Field, Int } from '@nestjs/graphql';
import Role from 'src/enums/roles.enum';
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsInt, IsOptional, IsPhoneNumber, IsUUID } from 'class-validator';
import { capabilities_default } from 'src/enums/capabilities.enum';
import { Profile } from './profile.entity';
import * as bcrypt from 'bcrypt';

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

  @Column(() => Profile)
  @Field({nullable: true})
  profile_info_: Profile

  @Field(type => [String], {nullable: true})
  @IsOptional()
  errors: string[]

  @Field({nullable: true})
  @IsOptional()
  messages: string
}
