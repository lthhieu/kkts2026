import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaideanDto } from './create-loaidean.dto';

export class UpdateLoaideanDto extends PartialType(CreateLoaideanDto) {}
