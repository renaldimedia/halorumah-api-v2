import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { City } from 'src/cities/entities/city.entity';
@Entity()
@Unique('subdistrict_unique',['subdistrict_code'])
@ObjectType()
export class Subdistrict extends BaseEntity  {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  subdistrict_code: string

  @Column({
    nullable: false
  })
  @Field()
  subdistrict_name: string

  @ManyToOne(() => City, (city) => city.subdistricts)
  @JoinColumn({name: 'city_id'})
  @Field(type => City, {nullable: true})
  city: City
}
