import { PartialType } from '@nestjs/mapped-types';
import { CreateMaytoantruongDto } from './create-maytoantruong.dto';

export class UpdateMaytoantruongDto extends PartialType(CreateMaytoantruongDto) {}
