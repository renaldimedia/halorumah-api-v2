import { ObjectType, Field } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
// import { City } from 'src/cities/entities/city.entity';
import { User } from 'src/users/entities/user.entity';
import { IsIn, IsInt, IsUUID } from 'class-validator';

@Entity()
@Unique('file_unique', ['filename', 'uniquekey'])
@ObjectType()
export class File {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  id: string;

  @Column({
    nullable: false
  })
  @Field()
  filename: string

  @Column({
    nullable: false
  })
  @Field()
  filepath: string

  @Column()
  @Field()
  mimetype: string

  @Column()
  @Field()
  @IsInt()
  size: number

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;

  @Column({type: 'uuid'})
  @Field()
  @ManyToMany(() => User, (user) => user.id)
  @JoinColumn()
  @IsUUID()
  uploaded_by: string

  @Column({nullable: true, type: 'uuid'})
  @Field(type => String, {nullable: true})
  @ManyToMany(() => User, (user) => user.id)
  @JoinColumn()
  @IsUUID()
  updated_by: string

  @Column({
    nullable: true
  })
  uniquekey: string

  @Column({
    nullable: true,
    type: 'int',
    default: 0
  })
  @IsIn([0, 1])
  marked_for_delete: number

  @Column({
    nullable: true,
    type: 'int',
    default: 1
  })
  @IsIn([0, 1])
  marked_for_optimize: number

  @Column({nullable: true})
  @Field(type => String, {nullable: true})
  rendered_url: string

  @Column({nullable: true, type: 'json'})
  @Field(type => String, {nullable: true})
  rendered_urls: string

  @Column({nullable: true, type: 'json'})
  @Field(type => String, {nullable: true})
  optimize_config: string
}
