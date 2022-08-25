import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { City } from 'src/cities/entities/city.entity';
@Entity()
@Unique('subdistrict_unique',['subdistrict_code'])
@ObjectType()
export class Subdistrict {
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

  @Column({nullable: false})
  @Field({nullable: false})
  @ManyToOne(() => City, (city) => city.id)
  @JoinColumn()
  city_id: number

  @Field(type => City, {nullable: true})
  city: City
}
