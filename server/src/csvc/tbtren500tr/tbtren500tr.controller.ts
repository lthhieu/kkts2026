import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { Tbtren500trService } from './tbtren500tr.service';
import { CreateTbtren500trDto } from './dto/create-tbtren500tr.dto';
import { UpdateTbtren500trDto } from './dto/update-tbtren500tr.dto';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import type { Response } from 'express';
import * as csv from 'fast-csv';

@UseGuards(PoliciesGuard)
@Controller('tbtren500tr')
export class Tbtren500trController {
  constructor(private readonly tbtren500trService: Tbtren500trService) { }

  @Post()
  @ResponseMessage('Tạo thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createTbtren500trDto: CreateTbtren500trDto) {
    return this.tbtren500trService.create(createTbtren500trDto);
  }


  @Post('/create-many')
  @ResponseMessage('Tạo thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createTbtren500trDto: CreateTbtren500trDto[]) {
    return this.tbtren500trService.createMany(createTbtren500trDto);
  }


  @Get('getall')
  @ResponseMessage('Tải thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findGetAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.tbtren500trService.findGetAll(+current, +pageSize, queryString);
  }

  @Get()
  @ResponseMessage('Tải thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.tbtren500trService.findAll(+current, +pageSize, queryString);
  }

  @Get('export')
  async exportCsv(
    @Res() res: Response,
  ) {
    const data =
      await this.tbtren500trService.exportAll();

    console.log(
      'parents:',
      data.length,
    );

    console.log(
      'children:',
      data.reduce(
        (sum, item: any) =>
          sum +
          (item.children?.length ?? 0),
        0,
      ),
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=tai-san.csv',
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
        'Đơn vị': parent.unit?.name,
        'Mã tài sản': parent.code,
        'Tên tài sản': parent.name,
        'Nguyên giá':
          parent.totalOriginalPrice,
        'Loại': 'Cha',
      });

      // tài sản con
      parent.children?.forEach(
        (child: any) => {
          csvStream.write({
            'Đơn vị':
              child.unit?.name,
            'Mã tài sản':
              child.code,
            'Tên tài sản':
              child.name,
            'Nguyên giá':
              child.originalPrice,
            'Loại': 'Con',
          });
        },
      );
    });

    csvStream.end();
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.tbtren500trService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateTbtren500trDto: UpdateTbtren500trDto) {
    return this.tbtren500trService.update(id, updateTbtren500trDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: string[]) {
    return this.tbtren500trService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa thiết bị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.tbtren500trService.remove(id);
  }
}
