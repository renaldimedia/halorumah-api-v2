import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// import { Package } from './package.entity';

@Entity()
@ObjectType()
export class PackageFeature  extends BaseEntity{
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({nullable: true})
  @Field(() => String, {nullable: true})
  feature_code: string;

  @Column({nullable: true})
  @Field(() => String, {nullable: true})
  feature_group?: string;

  @Column({nullable: true, default: 0, type: 'int'})
  @Field(() => Int, {nullable: true, defaultValue: 0})
  ord?:number;

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
  @JoinColumn({name: 'parent_id'})
  @Field(() => PackageFeature, {nullable: true})
  @IsOptional()
  parent_feature?: PackageFeature | null;

  // @OneToMany(type => PackageFeature, pack => pack.parent_feature)
  // parent_id: PackageFeature[];

  @OneToMany(type => PackageFeature, pack => pack.parent_feature)
  @Field(() => [PackageFeature], {nullable: true})
  subfeature?: PackageFeature[] | null;
}

@ObjectType()
export class PackageFeatureResponse{
  // @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  // @Column()
  @Field(() => String)
  feature_code: string;

  // @Column({nullable: true})
  @Field(() => String, {nullable: true})
  feature_group?: string;

  // @Column()
  @Field(() => String)
  feature_name: string;

  // @Column({nullable: true})
  @Field(() => String, {defaultValue: 'string', nullable: true})
  feature_type: string;

  // @Column({type: 'varchar', length: 255, nullable: true})
  @Field(() => String, {nullable: true})
  feature_value: any;

  // @Column({nullable: true})
  @Field(() => String, {nullable: true})
  feature_icon?: string;

  // @Column({nullable: true})
  @Field(() => String, {nullable: true})
  value_prefix?: string;

  // @Column({nullable: true})
  @Field(() => String, {nullable: true})
  value_suffix?: string;

  @Field(() => PackageFeature, {nullable: true})
  @IsOptional()
  parent_feature?: PackageFeature

  @Field(() => [PackageFeature], {nullable: true})
  subfeature?: PackageFeature[]
}

@ObjectType()
export class PackageBanefit{
  @Field(type => Int) 
  package_listings: number;
  @Field(type => Int, {nullable: true, defaultValue: 0})
  package_featured_listings: number;
}




// @Entity()
// @ObjectType()
// export class PackageFeatureGroup{
//     @PrimaryGeneratedColumn()
//     @Field(() => Int)
//     id: number;

    
// }
