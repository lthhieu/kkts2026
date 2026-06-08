import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { LythuyetService } from 'src/csvc/lythuyet/lythuyet.service';
import { CreateLythuyetDto } from 'src/csvc/lythuyet/dto/create-lythuyet.dto';
import { UpdateLythuyetDto } from 'src/csvc/lythuyet/dto/update-lythuyet.dto';
import type { Response } from 'express';
import * as csv from 'fast-csv';

@UseGuards(PoliciesGuard)
@Controller('lythuyet')
export class LythuyetController {
  constructor(private readonly lythuyetService: LythuyetService) { }

  @Post()
  @ResponseMessage('Tạo phòng lý thuyết thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createLythuyetDto: CreateLythuyetDto) {
    return this.lythuyetService.create(createLythuyetDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo phòng lý thuyết thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createLythuyetDto: CreateLythuyetDto[]) {
    return this.lythuyetService.createMany(createLythuyetDto);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan lý thuyết thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.lythuyetService.summary();
  }

  @Get('export')
  async exportCsv(@Res() res: Response) {
    const data = await this.lythuyetService.exportAll();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=ly-thuyet.csv',
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

    data.forEach((item: CreateLythuyetDto) => {
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
  @ResponseMessage('Tải phòng lý thuyết thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.lythuyetService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin phòng lý thuyết thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.lythuyetService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật phòng lý thuyết thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateLythuyetDto: UpdateLythuyetDto) {
    return this.lythuyetService.update(id, updateLythuyetDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa phòng lý thuyết thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.lythuyetService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa phòng lý thuyết thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.lythuyetService.remove(id);
  }
}
