import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { HoitruongService } from 'src/csvc/hoitruong/hoitruong.service';
import { CreateHoitruongDto } from 'src/csvc/hoitruong/dto/create-hoitruong.dto';
import { UpdateHoitruongDto } from 'src/csvc/hoitruong/dto/update-hoitruong.dto';

@UseGuards(PoliciesGuard)
@Controller('hoitruong')
export class HoitruongController {
  constructor(private readonly hoitruongService: HoitruongService) { }

  @Post()
  @ResponseMessage('Tạo hội trường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createHoitruongDto: CreateHoitruongDto) {
    return this.hoitruongService.create(createHoitruongDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo hội trường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createHoitruongDto: CreateHoitruongDto[]) {
    return this.hoitruongService.createMany(createHoitruongDto);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan hội trường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.hoitruongService.summary();
  }

  @Get()
  @ResponseMessage('Tải hội trường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.hoitruongService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin hội trường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.hoitruongService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật hội trường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateHoitruongDto: UpdateHoitruongDto) {
    return this.hoitruongService.update(id, updateHoitruongDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa hội trường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.hoitruongService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa hội trường thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.hoitruongService.remove(id);
  }
}
