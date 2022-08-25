import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PropertyMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  property: number

  @Column()
  master: string
}