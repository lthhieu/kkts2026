import { PartialType } from '@nestjs/mapped-types';
import { CreateToanhaDto } from './create-toanha.dto';

export class UpdateToanhaDto extends PartialType(CreateToanhaDto) {}
