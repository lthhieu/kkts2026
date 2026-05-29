import { PartialType } from '@nestjs/mapped-types';
import { CreatePgsgsDto } from 'src/csvc/pgsgs/dto/create-pgsgs.dto';

export class UpdatePgsgsDto extends PartialType(CreatePgsgsDto) { }
