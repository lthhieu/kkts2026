import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseArrayPipe, Res } from '@nestjs/common';
import { DevicesV2Service } from './devices-v2.service';
import { CreateDevicesV2Dto } from './dto/create-devices-v2.dto';
import { UpdateDevicesV2Dto } from './dto/update-devices-v2.dto';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/my.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DeviceSubject } from 'src/configs/enum';
import type { Response } from 'express';
import * as csv from 'fast-csv';

@Controller('devices-v2')
export class DevicesV2Controller {
  constructor(private readonly devicesV2Service: DevicesV2Service) { }

  @Post()
  @ResponseMessage('Tạo thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DeviceSubject))
  create(@Body() createDevicesV2Dto: CreateDevicesV2Dto) {
    return this.devicesV2Service.create(createDevicesV2Dto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DeviceSubject))
  createMany(@Body(new ParseArrayPipe({
    items: CreateDevicesV2Dto,
  }),) createDevicesV2Dto: CreateDevicesV2Dto[]) {
    return this.devicesV2Service.createMany(createDevicesV2Dto);
  }

  @Get('getall')
  @ResponseMessage('Tải thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DeviceSubject))
  findGetAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.devicesV2Service.findGetAll(+current, +pageSize, queryString);
  }

  @Get('export')
  async exportCsv(@Res() res: Response,
    @Query('type') type: string,
    @Query('unit') unit: string) {
    const data = await this.devicesV2Service.exportAll(type, unit);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=thiet-bi.csv',
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

    data.forEach((parent: any) => {
      // tài sản cha
      csvStream.write({
        'Tên thiết bị': parent.name,
        'Mã số/Mô tả': parent.description,
        'Nơi sử dụng': parent.currentRoom?.length
          ? parent.currentRoom
            .map((room: any) => room.name)
            .join(', ')
          : '',
        'Năm sử dụng': parent.usedYear,
        "Sổ KT - Số lượng": parent.kiemKe.soLuong,
        "Sổ KT - Nguyên giá": parent.kiemKe.nguyenGia,
        "Sổ KT - Giá trị còn lại": parent.kiemKe.giaTriConLai,
        "Kiểm kê - Số lượng": parent.soKeToan.soLuong,
        "Kiểm kê - Nguyên giá": parent.soKeToan.nguyenGia,
        "Kiểm kê - Giá trị còn lại": parent.soKeToan.giaTriConLai,
        "Chênh lệch - Thừa": parent.chenhLech.thua,
        "Chênh lệch - Thiếu": parent.chenhLech.thieu,
        "Chênh lệch - Giá trị còn lại": parent.chenhLech.giaTriConLai,
        "Chất lượng còn lại": parent.chatLuongConLai,
        "Ghi chú": parent.note,
        "Loại thiết bị": parent.type,
        "Trạng thái": parent.status,
        "Trọng số chất lượng": parent.trongSoChatLuong,
        'Loại': 'Cha',
      });


      // tài sản con
      parent.children?.forEach(
        (child: any) => {
          csvStream.write({
            'Tên thiết bị': child.name,
            'Mã số/Mô tả': child.description,
            'Nơi sử dụng': child.currentRoom?.length
              ? child.currentRoom
                .map((room: any) => room.name)
                .join(', ')
              : '',
            'Năm sử dụng': child.usedYear,
            "Sổ KT - Số lượng": child.kiemKe.soLuong,
            "Sổ KT - Nguyên giá": child.kiemKe.nguyenGia,
            "Sổ KT - Giá trị còn lại": child.kiemKe.giaTriConLai,
            "Kiểm kê - Số lượng": child.soKeToan.soLuong,
            "Kiểm kê - Nguyên giá": child.soKeToan.nguyenGia,
            "Kiểm kê - Giá trị còn lại": child.soKeToan.giaTriConLai,
            "Chênh lệch - Thừa": child.chenhLech.thua,
            "Chênh lệch - Thiếu": child.chenhLech.thieu,
            "Chênh lệch - Giá trị còn lại": child.chenhLech.giaTriConLai,
            "Chất lượng còn lại": child.chatLuongConLai,
            "Ghi chú": child.note,
            "Loại thiết bị": child.type,
            "Trạng thái": child.status,
            "Trọng số chất lượng": child.trongSoChatLuong,
            'Loại': 'Con',
          });
        },
      );
    });

    csvStream.end();
  }

  @Get()
  @ResponseMessage('Lấy danh sách thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DeviceSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string, @User() user: IUser) {
    return this.devicesV2Service.findAll(+current, +pageSize, queryString, user);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DeviceSubject))
  findOne(@Param('id') id: string) {
    return this.devicesV2Service.findOne(id);
  }

  @Patch('/update-many')
  @ResponseMessage('Cập nhật thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DeviceSubject))
  updateMany(@Body() data: { year: number }) {
    return this.devicesV2Service.updateAllQualityAggregate(data.year);
  }


  @Patch(':id')
  @ResponseMessage('Cập nhật thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DeviceSubject))
  update(@Param('id') id: string, @Body() updateDevicesV2Dto: UpdateDevicesV2Dto) {
    return this.devicesV2Service.update(id, updateDevicesV2Dto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DeviceSubject))
  removeMany(@Body() ids: any[]) {
    return this.devicesV2Service.removeMany(ids);
  }


  @Delete(':id')
  @ResponseMessage('Xóa thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DeviceSubject))
  remove(@Param('id') id: string) {
    return this.devicesV2Service.remove(id);
  }
}
