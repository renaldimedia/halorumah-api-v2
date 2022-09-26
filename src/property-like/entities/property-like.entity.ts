import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Property } from 'src/properties/entities/property.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique('like_unique',['property', 'user'])
@ObjectType()
export class PropertyLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property)
  @JoinColumn()
  @Field(type => Property)
  property: Property

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(type => User)
  user: User

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date;
}
