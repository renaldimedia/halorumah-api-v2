import { ObjectType, Field, Int, Float, InputType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PropertyMeta } from './property-meta.entity';

@Entity()
@ObjectType()
export class PropertyMetaMaster {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Index({unique: true})
  @Field()
  property_constant: string

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