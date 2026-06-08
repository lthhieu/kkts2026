import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { ToanhaService } from './toanha.service';
import { CreateToanhaDto } from './dto/create-toanha.dto';
import { UpdateToanhaDto } from './dto/update-toanha.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import * as csv from 'fast-csv';
import type { Response } from 'express';

@UseGuards(PoliciesGuard)
@Controller('toanha')
export class ToanhaController {
  constructor(private readonly toanhaService: ToanhaService) { }

  @Post()
  @ResponseMessage('Tạo toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createToanhaDto: CreateToanhaDto) {
    return this.toanhaService.create(createToanhaDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createToanhaDto: CreateToanhaDto[]) {
    return this.toanhaService.createMany(createToanhaDto);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.toanhaService.summary();
  }

  @Get()
  @ResponseMessage('Tải toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.toanhaService.findAll(+current, +pageSize, queryString);
  }

  @Get('export')
  async exportCsv(@Res() res: Response) {
    const data = await this.toanhaService.exportAll();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=toa-nha.csv',
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

    data.forEach((item: CreateToanhaDto) => {
      csvStream.write({
        'Mã toàn nhà': item.ma_toanha,
        'Tên tòa nhà': item.ten_toanha,
        'Diện tích xây dựng': item.dtxd,
        'Tông diện tích sàn xây dựng': item.tong_dt_sxd,
        'Số tầng': item.so_tang,
        'Năm đưa vào sử dụng': item.nam_sd,
        'Vị trí': item.place === 0 ? 'SPKT' : 'KTX',
      });
    });

    csvStream.end();
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.toanhaService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateToanhaDto: UpdateToanhaDto) {
    return this.toanhaService.update(id, updateToanhaDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.toanhaService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.toanhaService.remove(id);
  }
}
