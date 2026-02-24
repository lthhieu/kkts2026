import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DeviceSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) { }

  @Post()
  @ResponseMessage('Tạo thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DeviceSubject))
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DeviceSubject))
  createMany(@Body() createDeviceDto: CreateDeviceDto[]) {
    return this.devicesService.createMany(createDeviceDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DeviceSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.devicesService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DeviceSubject))
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thiết bị thành công')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto, @User() user: IUser) {
    return this.devicesService.update(id, updateDeviceDto, user);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DeviceSubject))
  removeMany(@Body() ids: any[], @User() user: IUser) {
    return this.devicesService.removeMany(ids, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa thiết bị thành công')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.devicesService.remove(id, user);
  }
}
