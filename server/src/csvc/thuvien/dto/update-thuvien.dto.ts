import { PartialType } from '@nestjs/mapped-types';
import { CreateThuvienDto } from './create-thuvien.dto';

export class UpdateThuvienDto extends PartialType(CreateThuvienDto) {}
