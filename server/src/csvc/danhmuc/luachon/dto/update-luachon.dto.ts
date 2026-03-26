import { PartialType } from '@nestjs/mapped-types';
import { CreateLuachonDto } from './create-luachon.dto';

export class UpdateLuachonDto extends PartialType(CreateLuachonDto) {}
