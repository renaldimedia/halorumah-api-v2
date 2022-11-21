import { PartialType } from '@nestjs/mapped-types';
import { CreateSyncDto } from './create-sync.dto';

export class UpdateSyncDto extends PartialType(CreateSyncDto) {}

export class UpdateStatSyncDto {
    id: number;
    step_left: number;
}
