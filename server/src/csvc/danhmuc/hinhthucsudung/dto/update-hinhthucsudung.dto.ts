import { PartialType } from '@nestjs/mapped-types';
import { CreateHinhthucsudungDto } from './create-hinhthucsudung.dto';

export class UpdateHinhthucsudungDto extends PartialType(CreateHinhthucsudungDto) {}
