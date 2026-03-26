import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaiphonghocDto } from './create-loaiphonghoc.dto';

export class UpdateLoaiphonghocDto extends PartialType(CreateLoaiphonghocDto) {}
