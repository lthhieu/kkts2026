import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { ChungtuService } from './chungtu.service';
import { CreateChungtuDto } from './dto/create-chungtu.dto';
import { UpdateChungtuDto } from './dto/update-chungtu.dto';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/my.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, ChungtuSubject } from 'src/configs/enum';
import type { Response } from 'express';
import * as csv from 'fast-csv';
import dayjs from 'dayjs';

@UseGuards(PoliciesGuard)
@Controller('chungtu')
export class ChungtuController {
  constructor(private readonly chungtuService: ChungtuService) { }

  @Post()
  @ResponseMessage('Tạo chứng từ thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, ChungtuSubject))
  create(@Body() createChungtuDto: CreateChungtuDto, @User() user: IUser) {
    return this.chungtuService.create(createChungtuDto, user);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo chứng từ thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, ChungtuSubject))
  createMany(@Body() dto: CreateChungtuDto[], @User() user: IUser) {
    console.log(dto)
    return this.chungtuService.createMany(dto, user);
  }

  @Get('export')
  async exportCsv(@Res() res: Response, @Query('month') month?: string,
    @Query('year') year?: string) {
    const data = await this.chungtuService.exportAll(month ? Number(month) : undefined,
      year ? Number(year) : undefined);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=chung-tu.csv',
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

    data.forEach((item: any) => {
      csvStream.write({
        'Ngày nhận': item.ngaynhan
          ? dayjs(item.ngaynhan).format('DD/MM/YYYY')
          : '-',
        'Nội dung': item.noidung,
        'Số tiền': item.sotien,
        'Ngày hoàn thành': item.ngayhoanthanh
          ? dayjs(item.ngayhoanthanh).format('DD/MM/YYYY')
          : '-',
        "Ghi chú": item.ghichu,
        "Tiền bằng chữ": item.tienbangchu,
        "Trạng thái": item.trangthai,
        "Nhà cung cấp": item.ncc.name
      });
    });

    csvStream.end();
  }

  @Get()
  @ResponseMessage('Lấy danh sách chứng từ thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, ChungtuSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.chungtuService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin chứng từ thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, ChungtuSubject))
  findOne(@Param('id') id: string) {
    return this.chungtuService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật chứng từ thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, ChungtuSubject))
  update(@Param('id') id: string, @Body() dto: UpdateChungtuDto, @User() user: IUser) {
    return this.chungtuService.update(id, dto, user);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa chứng từ thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, ChungtuSubject))
  removeMany(@Body() ids: any[]) {
    return this.chungtuService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa chứng từ thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, ChungtuSubject))
  remove(@Param('id') id: string) {
    return this.chungtuService.remove(id);
  }
}
