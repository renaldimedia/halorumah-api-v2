export class CreateSyncDto {
    // @Column({type: 'text'})
    data_name: string;

    // @Column()
    step_left: number;

    // @Column()
    data_processed: number;

    // @Column()
    data_ids_processed: string;

    // @Column({type: 'text'})
    endpoint: string;
}
