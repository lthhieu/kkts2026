import { PartialType } from '@nestjs/mapped-types';
import { CreateLythuyetDto } from 'src/csvc/lythuyet/dto/create-lythuyet.dto';

export class UpdateLythuyetDto extends PartialType(CreateLythuyetDto) { }
