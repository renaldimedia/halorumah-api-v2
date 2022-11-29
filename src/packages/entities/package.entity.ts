import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { UserPackages } from 'src/user-packages/entities/user-packages.entity';
// import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PackageFeatureResponse } from './package-feature.entity';
import { PackageFeatures } from './package-features.entity';

@Entity()
// @Unique('user_unique',['email', 'phone', 'device_id', 'username'])
@ObjectType()
export class Package {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({nullable: true})
  @Field(() => Int, {nullable: true})
  old_id: number;

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
  @Index({unique: true})
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

  @Column({nullable: true, default: 0, type: 'int'})
  @Field(() => Int, {nullable: true, defaultValue: 0})
  credit: number;

  @Column({nullable: true, default: 0, type: 'int'})
  @Field(() => Int, {nullable: true, defaultValue: 0})
  package_listings: number;

  @Column({nullable: true, default: 0, type: 'int'})
  @Field(() => Int, {nullable: true, defaultValue: 0})
  package_featured_listings: number;

  @Column({nullable: true, default: 0, type: 'int'})
  @Field(() => Int, {nullable: true, defaultValue: 0})
  vnov_credit: number;

  @OneToMany(() => PackageFeatures, pack => pack.package)
  package_features: PackageFeatures[]

  @OneToMany(() => UserPackages, (usr) => usr.package)
  @Field(() => [UserPackages])
  userpackages: UserPackages[];
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

  // @Column({nullable: true, default: 0, type: 'int'})
  @Field(() => Int, {nullable: true, defaultValue: 0})
  credit: number;

  @Field(() => Int, {nullable: true, defaultValue: 0})
  vnov_credit: number;

  // @Column({nullable: true, default: 0, type: 'int'})
  @Field(() => Int, {nullable: true, defaultValue: 0})
  package_listings: number;

  // @Column({nullable: true, default: 0, type: 'int'})
  @Field(() => Int, {nullable: true, defaultValue: 0})
  package_featured_listings: number;

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

  @Field(() => [PackageFeatureResponse])
  package_features: PackageFeatureResponse[]
}

