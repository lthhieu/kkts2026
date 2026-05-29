import { PartialType } from '@nestjs/mapped-types';
import { CreateHoitruongDto } from 'src/csvc/hoitruong/dto/create-hoitruong.dto';

export class UpdateHoitruongDto extends PartialType(CreateHoitruongDto) { }
