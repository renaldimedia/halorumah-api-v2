import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Country } from 'src/countries/entities/country.entity';
import { Expose } from 'class-transformer';
// import { Paginated } from 'src/pagination';
@Entity()
@Unique('province_unique',['province_code'])
@ObjectType()
@Expose()
export class Province {
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

  @Column()
  @Field()
  @ManyToOne(() => Country, (country) => country.id)
  @JoinColumn()
  country_id: number

  @Field(type => Country)
  country: Country
}

