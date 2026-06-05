import { PartialType } from '@nestjs/mapped-types';
import { CreateCholamvieccuagvDto } from 'src/csvc/cholamvieccuagv/dto/create-cholamvieccuagv.dto';

export class UpdateCholamvieccuagvDto extends PartialType(CreateCholamvieccuagvDto) { }
