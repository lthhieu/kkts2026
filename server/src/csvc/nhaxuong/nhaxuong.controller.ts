import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { NhaxuongService } from 'src/csvc/nhaxuong/nhaxuong.service';
import { CreateNhaxuongDto } from 'src/csvc/nhaxuong/dto/create-nhaxuong.dto';
import { UpdateNhaxuongDto } from 'src/csvc/nhaxuong/dto/update-nhaxuong.dto';
import type { Response } from 'express';
import * as csv from 'fast-csv';

@UseGuards(PoliciesGuard)
@Controller('nhaxuong')
export class NhaxuongController {
  constructor(private readonly nhaxuongService: NhaxuongService) { }

  @Post()
  @ResponseMessage('Tạo nhà xưởng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createNhaxuongDto: CreateNhaxuongDto) {
    return this.nhaxuongService.create(createNhaxuongDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo nhà xưởng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createNhaxuongDto: CreateNhaxuongDto[]) {
    return this.nhaxuongService.createMany(createNhaxuongDto);
  }
  @Get('export')
  async exportCsv(@Res() res: Response) {
    const data = await this.nhaxuongService.exportAll();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=nha-xuong.csv',
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

    data.forEach((item: CreateNhaxuongDto) => {
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
  @ResponseMessage('Tải nhà xưởng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.nhaxuongService.findAll(+current, +pageSize, queryString);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan nhà xưởng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.nhaxuongService.summary();
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin nhà xưởng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.nhaxuongService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật nhà xưởng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateNhaxuongDto: UpdateNhaxuongDto) {
    return this.nhaxuongService.update(id, updateNhaxuongDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa nhà xưởng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.nhaxuongService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa nhà xưởng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.nhaxuongService.remove(id);
  }
}
