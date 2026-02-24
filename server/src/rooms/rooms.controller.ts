import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, RoomSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) { }

  @Post()
  @ResponseMessage('Tạo phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, RoomSubject))
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo phòng thành công')
  createMany(@Body() createRoomDto: CreateRoomDto[]) {
    return this.roomsService.createMany(createRoomDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, RoomSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.roomsService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, RoomSubject))
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, RoomSubject))
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, RoomSubject))
  removeMany(@Body() ids: any[]) {
    return this.roomsService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, RoomSubject))
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
