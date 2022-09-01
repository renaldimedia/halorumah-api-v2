import { Field, ObjectType } from '@nestjs/graphql';
import { Any, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PropertyMetaMaster, PropertyMetaMasterResponse } from './property-meta-master.entity';
import { Property } from './property.entity';

@Entity()
export class PropertyMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Property)
  property: number

  @Column()
  @ManyToOne(() => PropertyMetaMaster, (mast) => mast.property_constant)
  master: string

  @Column()
  property_constant_value: string
}

@ObjectType()
export class PropertyMetaResponse {
  @Field()
  id: number;

  @Field()
  property: number

  @Field(type => String)
  master: string

  @Field()
  property_constant_value: string
}

@ObjectType()
export class PropertyFeatureResponse {
  @Field()
  feature_name: string

  @Field()
  feature_type: string

  @Field(type => String)
  feature_value: string
}