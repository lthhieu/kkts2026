import { PartialType } from '@nestjs/mapped-types';
import { CreateDevicesV2Dto } from './create-devices-v2.dto';

export class UpdateDevicesV2Dto extends PartialType(CreateDevicesV2Dto) {}
