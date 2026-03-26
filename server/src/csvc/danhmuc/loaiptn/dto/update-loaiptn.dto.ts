import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaiptnDto } from './create-loaiptn.dto';

export class UpdateLoaiptnDto extends PartialType(CreateLoaiptnDto) {}
