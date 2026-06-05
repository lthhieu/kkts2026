import { PartialType } from '@nestjs/mapped-types';
import { CreatePhongchucnangDto } from 'src/csvc/phongchucnang/dto/create-phongchucnang.dto';

export class UpdatePhongchucnangDto extends PartialType(CreatePhongchucnangDto) { }
