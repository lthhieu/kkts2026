import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { XaphuongService } from './xaphuong.service';
import { CreateXaphuongDto } from './dto/create-xaphuong.dto';
import { UpdateXaphuongDto } from './dto/update-xaphuong.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('xaphuong')
export class XaphuongController {
  constructor(private readonly xaphuongService: XaphuongService) { }

  @Post()
  @ResponseMessage('Tạo xã phường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createXaphuongDto: CreateXaphuongDto) {
    return this.xaphuongService.create(createXaphuongDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo xã phường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createXaphuongDto: CreateXaphuongDto[]) {
    return this.xaphuongService.createMany(createXaphuongDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách xã phường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.xaphuongService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin xã phường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.xaphuongService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật xã phường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateXaphuongDto: UpdateXaphuongDto) {
    return this.xaphuongService.update(id, updateXaphuongDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa xã phường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.xaphuongService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa xã phường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.xaphuongService.remove(id);
  }
}
