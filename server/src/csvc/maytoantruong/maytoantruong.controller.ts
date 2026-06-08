import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { MaytoantruongService } from './maytoantruong.service';
import { CreateMaytoantruongDto } from './dto/create-maytoantruong.dto';
import { UpdateMaytoantruongDto } from './dto/update-maytoantruong.dto';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import type { Response } from 'express';
import * as csv from 'fast-csv';
import { MayCate } from 'src/csvc/maytoantruong/schemas/maytoantruong.schema';


@UseGuards(PoliciesGuard)
@Controller('maytoantruong')
export class MaytoantruongController {
  constructor(private readonly maytoantruongService: MaytoantruongService) { }

  @Post()
  @ResponseMessage('Tạo tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createMaytoantruongDto: CreateMaytoantruongDto) {
    return this.maytoantruongService.create(createMaytoantruongDto);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.maytoantruongService.summary();
  }

  @Post('/create-many')
  @ResponseMessage('Tạo tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createMaytoantruongDto: CreateMaytoantruongDto[]) {
    return this.maytoantruongService.createMany(createMaytoantruongDto);
  }

  @Get('export')
  async exportCsv(
    @Res() res: any,
  ) {
    const data =
      await this.maytoantruongService.exportAll();

    const cateMap = {
      [MayCate.MAY_CAU_HINH_CAO]:
        'Máy cấu hình cao',
      [MayCate.LAPTOP_MAY_TINH_BANG]:
        'Laptop/Máy tính bảng',
      [MayCate.TUONG_DUONG_THAP]:
        'Máy tương đương thấp',
      [MayCate.MAY_IN]:
        'Máy in',
      [MayCate.MAY_SCAN]:
        'Máy scan',
    };

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=may-toan-truong.csv',
    );

    res.setHeader(
      'Content-Type',
      'text/csv; charset=utf-8',
    );

    // Fix lỗi tiếng Việt trên Excel
    res.write('\uFEFF');

    const csvStream = csv.format({
      headers: true,
      delimiter: ';',
    });

    csvStream.pipe(res);

    data.forEach((item: any) => {
      csvStream.write({
        'Loại máy':
          cateMap[item.cate] ??
          item.cate,

        'Tên máy':
          item.name,

        'Đơn vị':
          item.unit?.name ?? '',

        'Phòng':
          item.room?.name ?? '',

        'Năm sử dụng':
          item.nam_sd,

        'Số lượng':
          item.sl,

        'Nguyên giá':
          item.nguyengia,

        'Mô tả':
          item.des ?? '',
      });
    });

    csvStream.end();
  }

  @Get()
  @ResponseMessage('Tải tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.maytoantruongService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Tải tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.maytoantruongService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateMaytoantruongDto: UpdateMaytoantruongDto) {
    return this.maytoantruongService.update(id, updateMaytoantruongDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.maytoantruongService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.maytoantruongService.remove(id);
  }
}
