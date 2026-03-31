import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LuachonService } from './luachon.service';
import { CreateLuachonDto } from './dto/create-luachon.dto';
import { UpdateLuachonDto } from './dto/update-luachon.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('luachon')
export class LuachonController {
  constructor(private readonly luachonService: LuachonService) { }

  @Post()
  @ResponseMessage('Tạo lựa chọn thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createLuachonDto: CreateLuachonDto) {
    return this.luachonService.create(createLuachonDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo lựa chọn thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createLuachonDto: CreateLuachonDto[]) {
    return this.luachonService.createMany(createLuachonDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách lựa chọn thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.luachonService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin lựa chọn thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.luachonService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật lựa chọn thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateLuachonDto: UpdateLuachonDto) {
    return this.luachonService.update(id, updateLuachonDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa lựa chọn thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.luachonService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa lựa chọn thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.luachonService.remove(id);
  }
}
