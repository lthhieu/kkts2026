import { PartialType } from '@nestjs/mapped-types';
import { CreateCtkDto } from './create-ctk.dto';

export class UpdateCtkDto extends PartialType(CreateCtkDto) {}
