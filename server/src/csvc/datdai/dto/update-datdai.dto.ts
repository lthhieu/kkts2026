import { PartialType } from '@nestjs/mapped-types';
import { CreateDatdaiDto } from './create-datdai.dto';

export class UpdateDatdaiDto extends PartialType(CreateDatdaiDto) {}
