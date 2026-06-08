import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { NghiencuuService } from 'src/csvc/nghiencuu/nghiencuu.service';
import { CreateNghiencuuDto } from 'src/csvc/nghiencuu/dto/create-nghiencuu.dto';
import { UpdateNghiencuuDto } from 'src/csvc/nghiencuu/dto/update-nghiencuu.dto';
import type { Response } from 'express';
import * as csv from 'fast-csv';

@UseGuards(PoliciesGuard)
@Controller('nghiencuu')
export class NghiencuuController {
  constructor(private readonly nghiencuuService: NghiencuuService) { }

  @Post()
  @ResponseMessage('Tạo phòng nghiên cứu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createNghiencuuDto: CreateNghiencuuDto) {
    return this.nghiencuuService.create(createNghiencuuDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo phòng nghiên cứu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createNghiencuuDto: CreateNghiencuuDto[]) {
    return this.nghiencuuService.createMany(createNghiencuuDto);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan nghiên cứu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.nghiencuuService.summary();
  }

  @Get('export')
  async exportCsv(@Res() res: Response) {
    const data = await this.nghiencuuService.exportAll();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=nghien-cuu.csv',
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

    data.forEach((item: CreateNghiencuuDto) => {
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
  @ResponseMessage('Tải phòng nghiên cứu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.nghiencuuService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin phòng nghiên cứu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.nghiencuuService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật phòng nghiên cứu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateNghiencuuDto: UpdateNghiencuuDto) {
    return this.nghiencuuService.update(id, updateNghiencuuDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa phòng nghiên cứu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.nghiencuuService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa phòng nghiên cứu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.nghiencuuService.remove(id);
  }
}
