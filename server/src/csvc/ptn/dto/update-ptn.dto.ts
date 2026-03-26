import { PartialType } from '@nestjs/mapped-types';
import { CreatePtnDto } from './create-ptn.dto';

export class UpdatePtnDto extends PartialType(CreatePtnDto) {}
