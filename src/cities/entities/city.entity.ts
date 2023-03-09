import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Province } from 'src/provinces/entities/province.entity';
import { Subdistrict } from 'src/subdistricts/entities/subdistrict.entity';

@Entity()
@Unique('city_unique',['city_code'])
@ObjectType()
export class City extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  @Field({nullable: true})
  city_code: string

  @Column({
    nullable: false
  })
  @Field()
  city_name: string

  @Field(() => String, {nullable: true})
  search_url: string

  @ManyToOne(() => Province, (province) => province.cities)
  @JoinColumn({name: 'province_id'})
  @Field(type => Province, {nullable: true})
  province: Province

  @OneToMany(() => Subdistrict, (sub) => sub.city, {
    cascade: true, // <= here
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @Field(() => [Subdistrict], {nullable: true})
  subdistricts: Subdistrict[]
}
