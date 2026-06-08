import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { DatdaiService } from './datdai.service';
import { CreateDatdaiDto } from './dto/create-datdai.dto';
import { UpdateDatdaiDto } from './dto/update-datdai.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import type { Response } from 'express';
import * as csv from 'fast-csv';

@UseGuards(PoliciesGuard)
@Controller('datdai')
export class DatdaiController {
  constructor(private readonly datdaiService: DatdaiService) { }

  @Post()
  @ResponseMessage('Tạo đất đai thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createDatdaiDto: CreateDatdaiDto) {
    return this.datdaiService.create(createDatdaiDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo đất đai thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createDatdaiDto: CreateDatdaiDto[]) {
    return this.datdaiService.createMany(createDatdaiDto);
  }

  @Get()
  @ResponseMessage('Tải đất đai thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.datdaiService.findAll(+current, +pageSize, queryString);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan đất đai thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.datdaiService.summary();
  }

  @Get('export')
  async exportCsv(@Res() res: Response) {
    const data = await this.datdaiService.exportAll();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=dat-dai.csv',
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

    data.forEach((item) => {
      csvStream.write({
        'Mã giấy CNQSH': item.ma_giay_cnqsh,
        'Thửa': item.thua,
        'Diện tích': item.dt,
        'Địa chỉ': item.diachi,
        'Ghi chú': item.ghichu,
      });
    });

    csvStream.end();
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin đất đai thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.datdaiService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật đất đai thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateDatdaiDto: UpdateDatdaiDto) {
    return this.datdaiService.update(id, updateDatdaiDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa đất đai thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.datdaiService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa đất đai thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.datdaiService.remove(id);
  }
}
