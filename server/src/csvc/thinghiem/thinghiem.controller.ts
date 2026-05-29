import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { ThinghiemService } from 'src/csvc/thinghiem/thinghiem.service';
import { CreateThinghiemDto } from 'src/csvc/thinghiem/dto/create-thinghiem.dto';
import { UpdateThinghiemDto } from 'src/csvc/thinghiem/dto/update-thinghiem.dto';

@UseGuards(PoliciesGuard)
@Controller('thinghiem')
export class ThinghiemController {
  constructor(private readonly thinghiemService: ThinghiemService) { }

  @Post()
  @ResponseMessage('Tạo phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createThinghiemDto: CreateThinghiemDto) {
    return this.thinghiemService.create(createThinghiemDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createThinghiemDto: CreateThinghiemDto[]) {
    return this.thinghiemService.createMany(createThinghiemDto);
  }

  @Get()
  @ResponseMessage('Tải phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.thinghiemService.findAll(+current, +pageSize, queryString);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.thinghiemService.summary();
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.thinghiemService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateThinghiemDto: UpdateThinghiemDto) {
    return this.thinghiemService.update(id, updateThinghiemDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.thinghiemService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.thinghiemService.remove(id);
  }
}
