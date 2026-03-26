import { PartialType } from '@nestjs/mapped-types';
import { CreateTinhtrangsudungDto } from './create-tinhtrangsudung.dto';

export class UpdateTinhtrangsudungDto extends PartialType(CreateTinhtrangsudungDto) {}
