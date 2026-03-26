import { PartialType } from '@nestjs/mapped-types';
import { CreateMucdichsudungcsvcDto } from './create-mucdichsudungcsvc.dto';

export class UpdateMucdichsudungcsvcDto extends PartialType(CreateMucdichsudungcsvcDto) {}
