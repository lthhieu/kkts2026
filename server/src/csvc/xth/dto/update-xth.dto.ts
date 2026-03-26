import { PartialType } from '@nestjs/mapped-types';
import { CreateXthDto } from './create-xth.dto';

export class UpdateXthDto extends PartialType(CreateXthDto) {}
