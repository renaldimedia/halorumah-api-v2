import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Country } from 'src/countries/entities/country.entity';
import { Expose } from 'class-transformer';
import { City } from 'src/cities/entities/city.entity';
// import { Paginated } from 'src/pagination';
@Entity()
@Unique('province_unique',['province_code'])
@ObjectType()
@Expose()
export class Province extends BaseEntity  {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({
    nullable: true
  })
  @Field()
  province_code: string

  @Column({
    nullable: false
  })
  @Field()
  province_name: string

  @ManyToOne(() => Country, (country) => country.provinces)
  @JoinColumn({name: 'country_id'})
  @Field({nullable: true})
  country: Country;

  @OneToMany(() => City, (city) => city.province, {
    cascade: true, // <= here
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @Field(() => [City])
  cities: City[]

  // @Field(type => Country)
  // country: Country
}

