import { PartialType } from '@nestjs/mapped-types';
import { CreateTbtren500trDto } from './create-tbtren500tr.dto';

export class UpdateTbtren500trDto extends PartialType(CreateTbtren500trDto) { }
