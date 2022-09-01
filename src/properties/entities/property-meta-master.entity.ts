import { ObjectType, Field, Int, Float, InputType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PropertyMeta } from './property-meta.entity';

@Entity()
@ObjectType()
export class PropertyMetaMaster {
  @PrimaryColumn()
  @Field()
  property_constant: string

  @Column({nullable: true, default: "GENERAL"})
  @Field({nullable: true})
  property_constant_group: string

  @Column({nullable: true, default: "TEXT"})
  @Field({nullable: true})
  property_constant_type: string

  @Column({nullable: true})
  @Field()
  display_name: string

  @Column({nullable: true})
  @Field({nullable: true})
  icon: string
}

@ObjectType()
export class PropertyMetaMasterResponse {

  @Field(() => Int)
  id: number;

  @Field()
  property_constant: string

  @Field()
  property_constant_group: string

  @Field({nullable: true, defaultValue: 'text'})
  property_constant_type: string

  @Field()
  display_name: string

  @Field({nullable: true})
  icon: string
}

@InputType()
export class PropertyMetaMasterInput {

  @Field()
  property_constant: string

  @Field({nullable: true})
  display_name: string

  @Field({nullable: true})
  icon: string
}