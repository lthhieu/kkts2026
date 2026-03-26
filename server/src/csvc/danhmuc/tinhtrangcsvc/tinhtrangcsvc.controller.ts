import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TinhtrangcsvcService } from './tinhtrangcsvc.service';
import { CreateTinhtrangcsvcDto } from './dto/create-tinhtrangcsvc.dto';
import { UpdateTinhtrangcsvcDto } from './dto/update-tinhtrangcsvc.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('tinhtrangcsvc')
export class TinhtrangcsvcController {
  constructor(private readonly tinhtrangcsvcService: TinhtrangcsvcService) { }

  @Post()
  @ResponseMessage('Tạo tình trạng csvc thành công')
  create(@Body() createTinhtrangcsvcDto: CreateTinhtrangcsvcDto) {
    return this.tinhtrangcsvcService.create(createTinhtrangcsvcDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo tình trạng csvc thành công')
  createMany(@Body() createTinhtrangcsvcDto: CreateTinhtrangcsvcDto[]) {
    return this.tinhtrangcsvcService.createMany(createTinhtrangcsvcDto);
  }

  @Get()
  @ResponseMessage('Tải tình trạng csvc thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.tinhtrangcsvcService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin tình trạng csvc thành công')
  findOne(@Param('id') id: string) {
    return this.tinhtrangcsvcService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tình trạng csvc thành công')
  update(@Param('id') id: string, @Body() updateTinhtrangcsvcDto: UpdateTinhtrangcsvcDto) {
    return this.tinhtrangcsvcService.update(id, updateTinhtrangcsvcDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa tình trạng csvc thành công')
  removeMany(@Body() ids: any[]) {
    return this.tinhtrangcsvcService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tình trạng csvc thành công')
  remove(@Param('id') id: string) {
    return this.tinhtrangcsvcService.remove(id);
  }
}
