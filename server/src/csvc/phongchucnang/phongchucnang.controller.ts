import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { PhongchucnangService } from 'src/csvc/phongchucnang/phongchucnang.service';
import { CreatePhongchucnangDto } from 'src/csvc/phongchucnang/dto/create-phongchucnang.dto';
import { UpdatePhongchucnangDto } from 'src/csvc/phongchucnang/dto/update-phongchucnang.dto';

@UseGuards(PoliciesGuard)
@Controller('phongchucnang')
export class PhongchucnangController {
  constructor(private readonly phongchucnangService: PhongchucnangService) { }

  @Post()
  @ResponseMessage('Tạo phòng chức năng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createPhongchucnangDto: CreatePhongchucnangDto) {
    return this.phongchucnangService.create(createPhongchucnangDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo phòng chức năng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createPhongchucnangDto: CreatePhongchucnangDto[]) {
    return this.phongchucnangService.createMany(createPhongchucnangDto);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan chức năng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.phongchucnangService.summary();
  }

  @Get()
  @ResponseMessage('Tải phòng chức năng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.phongchucnangService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin phòng chức năng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.phongchucnangService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật phòng chức năng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updatePhongchucnangDto: UpdatePhongchucnangDto) {
    return this.phongchucnangService.update(id, updatePhongchucnangDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa phòng chức năng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.phongchucnangService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa phòng chức năng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.phongchucnangService.remove(id);
  }
}
