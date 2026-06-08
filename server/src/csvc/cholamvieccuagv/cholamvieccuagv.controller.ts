import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { CholamvieccuagvService } from 'src/csvc/cholamvieccuagv/cholamvieccuagv.service';
import { CreateCholamvieccuagvDto } from 'src/csvc/cholamvieccuagv/dto/create-cholamvieccuagv.dto';
import { UpdateCholamvieccuagvDto } from 'src/csvc/cholamvieccuagv/dto/update-cholamvieccuagv.dto';
import type { Response } from 'express';
import * as csv from 'fast-csv';


@UseGuards(PoliciesGuard)
@Controller('cholamvieccuagv')
export class CholamvieccuagvController {
  constructor(private readonly cholamvieccuagvService: CholamvieccuagvService) { }

  @Post()
  @ResponseMessage('Tạo phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createCholamvieccuagvDto: CreateCholamvieccuagvDto) {
    return this.cholamvieccuagvService.create(createCholamvieccuagvDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createCholamvieccuagvDto: CreateCholamvieccuagvDto[]) {
    return this.cholamvieccuagvService.createMany(createCholamvieccuagvDto);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.cholamvieccuagvService.summary();
  }

  @Get('export')
  async exportCsv(@Res() res: Response) {
    const data = await this.cholamvieccuagvService.exportAll();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=cho-lam-viec-cua-gv.csv',
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

    data.forEach((item: CreateCholamvieccuagvDto) => {
      csvStream.write({
        'Mã phòng': item.ma,
        'Tên phòng': item.name,
        'Diện tích': item.dt
      });
    });

    csvStream.end();
  }

  @Get()
  @ResponseMessage('Tải phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.cholamvieccuagvService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.cholamvieccuagvService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateCholamvieccuagvDto: UpdateCholamvieccuagvDto) {
    return this.cholamvieccuagvService.update(id, updateCholamvieccuagvDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.cholamvieccuagvService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.cholamvieccuagvService.remove(id);
  }
}
