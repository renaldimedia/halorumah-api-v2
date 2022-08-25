import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique('country_unique',['country_code'])
@ObjectType()
export class Country {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({
    nullable: true,
  })
  @Field()
  country_code: string

  @Column()
  @Field()
  country_name: string
}
