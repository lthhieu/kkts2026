import { PartialType } from '@nestjs/mapped-types';
import { CreatePhanloaiDto } from './create-phanloai.dto';

export class UpdatePhanloaiDto extends PartialType(CreatePhanloaiDto) {}
