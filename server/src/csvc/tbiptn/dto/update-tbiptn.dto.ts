import { PartialType } from '@nestjs/mapped-types';
import { CreateTbiptnDto } from './create-tbiptn.dto';

export class UpdateTbiptnDto extends PartialType(CreateTbiptnDto) {}
