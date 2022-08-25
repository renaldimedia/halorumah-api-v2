import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { File } from 'src/files/entities/file.entity';
import { Country } from 'src/countries/entities/country.entity';
import { Province } from 'src/provinces/entities/province.entity';
import { City } from 'src/cities/entities/city.entity';
import { Subdistrict } from 'src/subdistricts/entities/subdistrict.entity';
import { User } from 'src/users/entities/user.entity';
import { PropertyMeta } from './property-meta.entity';
import { IsIn, IsOptional } from 'class-validator';
import propAgeConstants from 'src/enums/propAgeConstans.enum';
import purchaseTypes from 'src/enums/purchaseType.enum';
import propPurchaseStatus from 'src/enums/propPurchaseStatus.enum';
import saleTypes from 'src/enums/saleTypes.enum';
import { PropertyListImages } from './property-list-images.entity';

@Entity()
@ObjectType()
export class Property {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  // Required fields
  @Column({nullable: true, unique: true})
  @Index({unique: true})
  @Field(type => String, {nullable: true})
  property_code: string

  @Column()
  @Index({unique: true})
  @Field(type => String, {nullable: false})
  property_title: string

  @Column()
  @Field(type => String, {nullable: false})
  property_desc: string

  @Column()
  @Field(type => Int)
  property_price: number

  @Column({nullable: true})
  @Field(type => Int, {nullable: true})
  @IsOptional()
  property_price_second: number

  @Column()
  @Field(type => String, {nullable: false})
  property_type: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, nullable: true })
  @Field()
  property_area_size: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0, nullable: true })
  @Field()
  property_building_size: number;

  @Column()
  @Field(type => Int, {nullable: false})
  property_bathroom_count: number

  @Column()
  @Field(type => Int, {nullable: false})
  property_bedroom_count: number

  @Column()
  @Field(type => Int, {nullable: true, defaultValue: 0})
  property_garage_count: number

  @Column()
  @Field(type => String, {nullable: false})
  property_certificate_type: string

  @Column()
  @ManyToOne(() => File)
  @Field({nullable: false})
  property_featured_image: string

  // @Column()
  // @ManyToOne(() => File)
  // @Field({nullable: false})
  // resolve_property_featured_image: string


  @Column({nullable: true})
  @ManyToOne(() => Country)
  @Field({nullable: true})
  country: number

  @Column({nullable: true})
  @ManyToOne(() => Province)
  @Field({nullable: true})
  province: number

  @Column({nullable: true})
  @ManyToOne(() => City)
  @Field({nullable: true})
  city: number

  @Column({nullable: true})
  @ManyToOne(() => Subdistrict)
  @Field({nullable: true})
  subdistrict: number

  @Column({type: 'text', nullable: false})
  @Field(type => String, {nullable: false})
  property_full_address: string

  @Column()
  @Field(type => String)
  created_by_user: String

  @Column()
  @Field(type => String)
  call_to_user: String

  @OneToMany(() => PropertyMeta, (pm) => pm.property)
  metas: PropertyMeta[]

  @Column({type: 'text',nullable: true})
  search_key: string

  @Column({
    nullable: true
  })
  @Field()
  property_build_years: number

  @Column({
    nullable: true
  })
  @Field()
  @IsIn(Object.values(propAgeConstants))
  property_condition: string

  @Column({
    default: 0
  })
  @Field()
  total_views: number

  @Column({
    default: 0
  })
  @Field()
  total_star: number

  @Column({
    default: 0
  })
  @Field()
  total_leads: number

  @Column({
    default: 0
  })
  @Field()
  total_messages: number

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date;

  @Column({
    type: 'varchar',
    default: saleTypes.SALE,
  })
  @Field()
  @IsIn(Object.values(saleTypes))
  sales_type: string;

  @Column()
  @Field()
  @IsIn(Object.values(propPurchaseStatus))
  sales_status: string;

  @Column({
    type: 'varchar',
    default: purchaseTypes.ONCE,
  })
  @Field({nullable: true})
  @IsIn(Object.values(purchaseTypes))
  purchase_type: string;
}


