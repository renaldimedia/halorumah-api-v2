import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PropertyMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  property: number

  @Column()
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

  @Field()
  master: string

  @Field()
  property_constant_value: string
}