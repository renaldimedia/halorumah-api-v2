import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Sync {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text'})
    data_name: string;

    @Column()
    step_left: number;

    @Column()
    data_processed: number;

    @Column()
    data_ids_processed: string;

    @Column({type: 'text'})
    endpoint: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;
  
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
}
