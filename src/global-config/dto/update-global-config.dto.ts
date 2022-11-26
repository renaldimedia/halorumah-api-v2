import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalConfigDto } from './create-global-config.dto';

export class UpdateGlobalConfigDto extends PartialType(CreateGlobalConfigDto) {}
