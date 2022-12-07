import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Province } from 'src/provinces/entities/province.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique('country_unique', ['country_code'])
@ObjectType()
export class Country extends BaseEntity {
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

  @OneToMany(() => Province, (prov) => prov.country, {
    cascade: true, // <= here
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @Field(() => [Province])
  provinces: Province[]
}
