import { PartialType } from '@nestjs/mapped-types';
import { CreateNccDto } from 'src/qlchungtu/ncc/dto/create-ncc.dto';

export class UpdateNccDto extends PartialType(CreateNccDto) { }
