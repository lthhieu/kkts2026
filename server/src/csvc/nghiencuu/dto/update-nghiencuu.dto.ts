import { PartialType } from '@nestjs/mapped-types';
import { CreateNghiencuuDto } from 'src/csvc/nghiencuu/dto/create-nghiencuu.dto';

export class UpdateNghiencuuDto extends PartialType(CreateNghiencuuDto) { }
