import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { City } from 'src/cities/entities/city.entity';

@Entity()
@Unique('district_unique',['district_code'])
@ObjectType()
export class District extends BaseEntity  {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({nullable: true})
  @Field({nullable: true})
  district_code: string

  @Column({
    nullable: false
  })
  @Field()
  district_name: string

  @ManyToOne(() => City, (city) => city.subdistricts)
  @JoinColumn({name: 'city_id'})
  @Field(type => City, {nullable: true})
  city: City
}
