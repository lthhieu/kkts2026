import { PartialType } from '@nestjs/mapped-types';
import { CreateChungtuDto } from './create-chungtu.dto';

export class UpdateChungtuDto extends PartialType(CreateChungtuDto) {}
