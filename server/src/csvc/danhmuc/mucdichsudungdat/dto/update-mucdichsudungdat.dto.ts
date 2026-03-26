import { PartialType } from '@nestjs/mapped-types';
import { CreateMucdichsudungdatDto } from './create-mucdichsudungdat.dto';

export class UpdateMucdichsudungdatDto extends PartialType(CreateMucdichsudungdatDto) {}
