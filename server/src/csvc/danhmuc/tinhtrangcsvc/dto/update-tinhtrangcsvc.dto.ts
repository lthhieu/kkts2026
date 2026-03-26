import { PartialType } from '@nestjs/mapped-types';
import { CreateTinhtrangcsvcDto } from './create-tinhtrangcsvc.dto';

export class UpdateTinhtrangcsvcDto extends PartialType(CreateTinhtrangcsvcDto) {}
