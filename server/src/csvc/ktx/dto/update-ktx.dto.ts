import { PartialType } from '@nestjs/mapped-types';
import { CreateKtxDto } from './create-ktx.dto';

export class UpdateKtxDto extends PartialType(CreateKtxDto) {}
