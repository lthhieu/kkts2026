import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsOptional } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
    @IsOptional()
    users?: any
}
