import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Package } from './package.entity';

@Entity()
@ObjectType()
export class PackageFeature{
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  feature_code: string;

  @Column({nullable: true})
  @Field(() => String, {nullable: true})
  feature_group?: string;

  @Column()
  @Field(() => String)
  feature_name: string;

  @Column({nullable: true})
  @Field(() => String, {defaultValue: 'string', nullable: true})
  feature_type: string;

  @Column({type: 'varchar', length: 255, nullable: true})
  @Field(() => String, {nullable: true})
  feature_value: any;

  @Column({nullable: true})
  @Field(() => String, {nullable: true})
  feature_icon?: string;

  @Column({nullable: true})
  @Field(() => String, {nullable: true})
  value_prefix?: string;

  @Column({nullable: true})
  @Field(() => String, {nullable: true})
  value_suffix?: string;

  @ManyToOne(type => PackageFeature)
  // @JoinTable()
  @Field(() => PackageFeature, {nullable: true})
  @IsOptional()
  parent_feature?: PackageFeature
}

// @Entity()
// @ObjectType()
// export class PackageFeatureGroup{
//     @PrimaryGeneratedColumn()
//     @Field(() => Int)
//     id: number;

    
// }
