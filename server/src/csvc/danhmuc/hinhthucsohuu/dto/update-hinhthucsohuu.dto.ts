import { PartialType } from '@nestjs/mapped-types';
import { CreateHinhthucsohuuDto } from './create-hinhthucsohuu.dto';

export class UpdateHinhthucsohuuDto extends PartialType(CreateHinhthucsohuuDto) {}
