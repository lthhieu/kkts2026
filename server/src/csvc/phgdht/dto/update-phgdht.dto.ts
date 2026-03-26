import { PartialType } from '@nestjs/mapped-types';
import { CreatePhgdhtDto } from './create-phgdht.dto';

export class UpdatePhgdhtDto extends PartialType(CreatePhgdhtDto) {}
