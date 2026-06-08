import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { HoitruongService } from 'src/csvc/hoitruong/hoitruong.service';
import { CreateHoitruongDto } from 'src/csvc/hoitruong/dto/create-hoitruong.dto';
import { UpdateHoitruongDto } from 'src/csvc/hoitruong/dto/update-hoitruong.dto';
import type { Response } from 'express';
import * as csv from 'fast-csv';

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

  @Get('export')
  async exportCsv(@Res() res: Response) {
    const data = await this.hoitruongService.exportAll();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=hoi-truong.csv',
    );

    res.setHeader(
      'Content-Type',
      'text/csv; charset=utf-8',
    );

    // BOM cho Excel
    res.write('\uFEFF');

    const csvStream = csv.format({
      headers: true,
      delimiter: ';',
    });

    csvStream.pipe(res);

    data.forEach((item: CreateHoitruongDto) => {
      csvStream.write({
        'Mã phòng': item.ma,
        'Tên phòng': item.name,
        'Diện tích': item.dt,
        'Số chỗ ngồi': item.qui_mo_cho_ngoi,
        'Năm sử dụng': item.nam_sd,
      });
    });

    csvStream.end();
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
