import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Province } from 'src/provinces/entities/province.entity';
@Entity()
@Unique('city_unique',['city_code'])
@ObjectType()
export class City extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  city_code: string

  @Column({
    nullable: false
  })
  @Field()
  city_name: string

  @Column()
  @ManyToOne(() => Province, (province) => province.id)
  @JoinColumn()
  province_id: number

  @Field(type => Province, {nullable: true})
  province: Province
}
