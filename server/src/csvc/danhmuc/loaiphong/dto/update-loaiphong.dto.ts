import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaiphongDto } from './create-loaiphong.dto';

export class UpdateLoaiphongDto extends PartialType(CreateLoaiphongDto) { }
