import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, UseGuards } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, ChungtuSubject } from 'src/configs/enum';
import type { Response } from 'express';
import * as csv from 'fast-csv';
import { NccsService } from 'src/qlchungtu/ncc/ncc.service';
import { CreateNccDto } from 'src/qlchungtu/ncc/dto/create-ncc.dto';
import { UpdateNccDto } from 'src/qlchungtu/ncc/dto/update-ncc.dto';

@UseGuards(PoliciesGuard)
@Controller('ncc')
export class NccsController {
  constructor(private readonly nccsService: NccsService) { }

  @Post()
  @ResponseMessage('Tạo nhà cung cấp thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, ChungtuSubject))
  create(@Body() dto: CreateNccDto) {
    return this.nccsService.create(dto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo nhà cung cấp thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, ChungtuSubject))
  createMany(@Body() dto: CreateNccDto[]) {
    return this.nccsService.createMany(dto);
  }

  @Get('export')
  async exportCsv(@Res() res: Response) {
    const data = await this.nccsService.exportAll();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=ncc.csv',
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

    data.forEach((item: CreateNccDto) => {
      csvStream.write({
        'Tên nhà cung cấp': item.name
      });
    });

    csvStream.end();
  }

  @Get()
  @ResponseMessage('Lấy danh sách nhà cung cấp thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, ChungtuSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.nccsService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin nhà cung cấp thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, ChungtuSubject))
  findOne(@Param('id') id: string) {
    return this.nccsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật nhà cung cấp thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, ChungtuSubject))
  update(@Param('id') id: string, @Body() dto: UpdateNccDto) {
    return this.nccsService.update(id, dto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa nhà cung cấp thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, ChungtuSubject))
  removeMany(@Body() ids: any[]) {
    return this.nccsService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa nhà cung cấp thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, ChungtuSubject))
  remove(@Param('id') id: string) {
    return this.nccsService.remove(id);
  }
}
