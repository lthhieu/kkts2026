import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaicongtrinhcsvcDto } from './create-loaicongtrinhcsvc.dto';

export class UpdateLoaicongtrinhcsvcDto extends PartialType(CreateLoaicongtrinhcsvcDto) {}
