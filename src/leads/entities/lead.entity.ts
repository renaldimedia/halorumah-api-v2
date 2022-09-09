import { ObjectType, Field, Int} from '@nestjs/graphql';
import { IsJSON, IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['phone', 'email', 'source_url', 'lead_object_id', 'lead_type'], {unique: true})
@ObjectType()
export class Lead {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({type: 'varchar', length: 255})
  @Field(type => String)
  full_name: string

  @Column({type: 'varchar', length: 255})
  @Field(type => String)
  phone: string

  @Column({type: 'varchar', length: 255, nullable: true})
  @Field(type => String)
  email: string

  @ManyToOne(() => User, {nullable: true})
  @Field(type => User, {nullable: true})
  user: string

  @Column({type: 'json', nullable: true})
  @Field(type => String, {nullable: true})
  @IsOptional()
  @IsJSON()
  extra: string

  @Column({type: 'varchar', length: 255})
  @Field(type => String)
  lead_type: string

  @Column({type: 'varchar', length: 512, nullable: true})
  @Field(type => String, {nullable: true})
  source_url: string

  @Column({type: 'varchar', length: 255, nullable: true})
  @Field(type => String, {nullable: true})
  lead_object_id: string
}

@ObjectType()
export class LeadExtraResponse{
  @Field(type => String)
  key: string

  @Field(type => String)
  value: string
}

@ObjectType()
export class LeadResponse{
  // @PrimaryGeneratedColumn()
  @Field(() => Int, {nullable: true})
  id: number;

  // @Column({type: 'varchar', length: 255})
  @Field(type => String, {nullable: true})
  full_name: string

  // @Column({type: 'varchar', length: 255})
  @Field(type => String, {nullable: true})
  phone: string

  // @Column({type: 'varchar', length: 255})
  @Field(type => String, {nullable: true})
  email: string

  // @Column({type: 'json', nullable: true})
  @Field(type => [LeadExtraResponse], {nullable: true})
  // @IsOptional()
  // @IsJSON()
  extra: LeadExtraResponse[]

  // @Column({type: 'varchar', length: 255})
  @Field(type => String)
  lead_type: string

  // @Column({type: 'varchar', length: 512, nullable: true})
  @Field(type => String, {nullable: true})
  source_url: string

  // @Column({type: 'varchar', length: 255, nullable: true})
  @Field(type => String, {nullable: true})
  lead_object_id: string
}
