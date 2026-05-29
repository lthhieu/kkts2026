import { PartialType } from '@nestjs/mapped-types';
import { CreateNhaxuongDto } from 'src/csvc/nhaxuong/dto/create-nhaxuong.dto';

export class UpdateNhaxuongDto extends PartialType(CreateNhaxuongDto) { }
