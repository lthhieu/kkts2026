import { PartialType } from '@nestjs/mapped-types';
import { CreateThinghiemDto } from 'src/csvc/thinghiem/dto/create-thinghiem.dto';

export class UpdateThinghiemDto extends PartialType(CreateThinghiemDto) { }
