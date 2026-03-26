import { PartialType } from '@nestjs/mapped-types';
import { CreateTinhthanhphoDto } from './create-tinhthanhpho.dto';

export class UpdateTinhthanhphoDto extends PartialType(CreateTinhthanhphoDto) {}
