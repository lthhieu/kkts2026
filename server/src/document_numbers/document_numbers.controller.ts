import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res } from '@nestjs/common';
import { DocumentNumbersService } from './document_numbers.service';
import { CreateDocumentNumberDto } from './dto/create-document_number.dto';
import { UpdateDocumentNumberDto } from './dto/update-document_number.dto';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/my.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DocumentNumbersSubject } from 'src/configs/enum';
import type { Response } from 'express';
import * as csv from 'fast-csv';
import { DocumentNumber } from './schemas/document_number.schema';

@UseGuards(PoliciesGuard)
@Controller('document-numbers')
export class DocumentNumbersController {
  constructor(private readonly documentNumbersService: DocumentNumbersService) { }

  @Post()
  @ResponseMessage('Tạo số văn bản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DocumentNumbersSubject))
  create(@Body() createDocumentNumberDto: CreateDocumentNumberDto, @User() user: IUser) {
    return this.documentNumbersService.create(createDocumentNumberDto, user);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo số văn bản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DocumentNumbersSubject))
  createMany(@Body() createDocumentNumberDto: CreateDocumentNumberDto[]) {
    return this.documentNumbersService.createMany(createDocumentNumberDto);
  }

  @Get('export')
  @ResponseMessage('Export thành công')
  async exportCsv(@Res() res: Response) {
    const data = await this.documentNumbersService.exportAll();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=so-van-ban.csv',
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

    data.forEach((item: DocumentNumber) => {
      csvStream.write({
        'Ngày tạo số văn bản': item?.issue_date,
        'Loại văn bản': item?.type,
        'Năm cấp số': item?.year,
        'Số văn bản': item?.number,
        'Nội dung': item?.content,
        'Số tiền': item?.money
      });
    });

    csvStream.end();
  }

  @Get()
  @ResponseMessage('Lấy danh sách số văn bản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DocumentNumbersSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.documentNumbersService.findAll(+current, +pageSize, queryString);
  }


  @Get(':id')
  @ResponseMessage('Lấy thông tin số văn bản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DocumentNumbersSubject))
  findOne(@Param('id') id: string) {
    return this.documentNumbersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật số văn bản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DocumentNumbersSubject))
  update(@Param('id') id: string, @Body() updateDocumentNumberDto: UpdateDocumentNumberDto) {
    return this.documentNumbersService.update(id, updateDocumentNumberDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa số văn bản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DocumentNumbersSubject))
  removeMany(@Body() ids: any[]) {
    return this.documentNumbersService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa số văn bản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DocumentNumbersSubject))
  remove(@Param('id') id: string) {
    return this.documentNumbersService.remove(id);
  }
}
