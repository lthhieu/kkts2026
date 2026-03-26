import { PartialType } from '@nestjs/mapped-types';
import { CreateXaphuongDto } from './create-xaphuong.dto';

export class UpdateXaphuongDto extends PartialType(CreateXaphuongDto) {}
