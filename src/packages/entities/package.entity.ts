import { ObjectType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PackageFeature } from './package-feature.entity';
import { PackageFeatures } from './package-features.entity';

@Entity()
@ObjectType()
export class Package {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({type: 'int', nullable: true, default: 0})
  @Field(() => Int, {nullable: true, defaultValue: 0})
  ord?: number;

  @Column()
  @Field(() => String)
  package_name: string;

  @Column({type: 'int'})
  @Field(() => Int)
  package_price: number;

  @Column()
  @Field(() => String)
  package_icon: string;

  @Column()
  @Field(() => String)
  package_display_name: string;

  @Column()
  @Field(() => String, {nullable: true})
  package_code: string;

  @Column()
  @Field(() => Int)
  package_billing_time_unit: number;

  @Column()
  @Field(() => String)
  package_billing_unit: string;

  @Column({type: 'boolean', default: true})
  @Field(() => Boolean, {nullable: true, defaultValue: true})
  @IsOptional()
  is_displayed?: boolean;

  @Column({type: 'boolean', default: true})
  @Field(() => Boolean, {nullable: true, defaultValue: true})
  @IsOptional()
  is_enable?: boolean;

  @Column({type: 'boolean', default: false})
  @Field(() => Boolean, {nullable: true, defaultValue: false})
  @IsOptional()
  is_popular?: boolean;

  @OneToMany(() => PackageFeatures, pack => pack.package)
  package_features: PackageFeatures[]

}


@ObjectType()
export class PackageResponse{
  @Field(() => Int)
  id: number;

  // @Column()
  @Field(() => String)
  package_name: string;

  // @Column({type: 'int'})
  @Field(() => Int)
  package_price: number;

  // @Column()
  @Field(() => String)
  package_icon: string;

  // @Column()
  @Field(() => String)
  package_display_name: string;

  // @Column()
  @Field(() => String)
  package_code: string;

  // @Column()
  @Field(() => Int)
  package_billing_time_unit: number;

  // @Column()
  @Field(() => String)
  package_billing_unit: string;

  // @Column({type: 'boolean', default: true})
  @Field(() => Boolean, {nullable: true, defaultValue: true})
  @IsOptional()
  is_displayed?: boolean;

  // @Column({type: 'boolean', default: true})
  @Field(() => Boolean, {nullable: true, defaultValue: true})
  @IsOptional()
  is_enable?: boolean;

  // @Column({type: 'boolean', default: false})
  @Field(() => Boolean, {nullable: true, defaultValue: false})
  @IsOptional()
  is_popular?: boolean;

  @Field(() => [PackageFeature])
  package_features: PackageFeature[]
}

