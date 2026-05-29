import { PartialType } from '@nestjs/mapped-types';
import { CreateThuchanhDto } from 'src/csvc/thuchanh/dto/create-thuchanh.dto';

export class UpdateThuchanhDto extends PartialType(CreateThuchanhDto) { }
