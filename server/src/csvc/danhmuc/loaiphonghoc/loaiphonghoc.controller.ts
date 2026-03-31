import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LoaiphonghocService } from './loaiphonghoc.service';
import { CreateLoaiphonghocDto } from './dto/create-loaiphonghoc.dto';
import { UpdateLoaiphonghocDto } from './dto/update-loaiphonghoc.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('loaiphonghoc')
export class LoaiphonghocController {
  constructor(private readonly loaiphonghocService: LoaiphonghocService) { }

  @Post()
  @ResponseMessage('Tạo loại phòng học thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createLoaiphonghocDto: CreateLoaiphonghocDto) {
    return this.loaiphonghocService.create(createLoaiphonghocDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo loại phòng học thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createLoaiphonghocDto: CreateLoaiphonghocDto[]) {
    return this.loaiphonghocService.createMany(createLoaiphonghocDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách loại phòng học thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.loaiphonghocService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin loại phòng học thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.loaiphonghocService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật loại phòng học thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateLoaiphonghocDto: UpdateLoaiphonghocDto) {
    return this.loaiphonghocService.update(id, updateLoaiphonghocDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa loại phòng học thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.loaiphonghocService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa loại phòng học thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.loaiphonghocService.remove(id);
  }
}
