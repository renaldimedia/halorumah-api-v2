import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PackageFeature } from './package-feature.entity';
import { Package } from './package.entity';

@Entity()
@ObjectType()
export class PackageFeatures extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @ManyToOne(type => Package, pack => pack.id)
  @Field(() => Package)
  package: Package;

  @ManyToOne(type => PackageFeature, pack => pack.id)
  @Field(() => PackageFeature)
  feature: PackageFeature;

  @Column()
  @Field(() => String)
  feature_value: string;
}