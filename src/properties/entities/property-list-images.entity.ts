import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PropertyMetaMaster } from './property-meta-master.entity';
import { Property } from './property.entity';
import { File } from 'src/files/entities/file.entity';
import { Field } from '@nestjs/graphql';

@Entity()
export class PropertyListImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  property: number

  @Column()
  file: string
}