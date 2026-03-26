import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LoaicongtrinhcsvcService } from './loaicongtrinhcsvc.service';
import { CreateLoaicongtrinhcsvcDto } from './dto/create-loaicongtrinhcsvc.dto';
import { UpdateLoaicongtrinhcsvcDto } from './dto/update-loaicongtrinhcsvc.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('loaicongtrinhcsvc')
export class LoaicongtrinhcsvcController {
  constructor(private readonly loaicongtrinhcsvcService: LoaicongtrinhcsvcService) { }

  @Post()
  @ResponseMessage('Tạo loại công trình csvc thành công')
  create(@Body() createLoaicongtrinhcsvcDto: CreateLoaicongtrinhcsvcDto) {
    return this.loaicongtrinhcsvcService.create(createLoaicongtrinhcsvcDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo loại công trình csvc thành công')
  createMany(@Body() createLoaicongtrinhcsvcDto: CreateLoaicongtrinhcsvcDto[]) {
    return this.loaicongtrinhcsvcService.createMany(createLoaicongtrinhcsvcDto);
  }

  @Get()
  @ResponseMessage('Tải loại công trình csvc thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.loaicongtrinhcsvcService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin loại công trình csvc thành công')
  findOne(@Param('id') id: string) {
    return this.loaicongtrinhcsvcService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật loại công trình csvc thành công')
  update(@Param('id') id: string, @Body() updateLoaicongtrinhcsvcDto: UpdateLoaicongtrinhcsvcDto) {
    return this.loaicongtrinhcsvcService.update(id, updateLoaicongtrinhcsvcDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa loại công trình csvc thành công')
  removeMany(@Body() ids: any[]) {
    return this.loaicongtrinhcsvcService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa loại công trình csvc thành công')
  remove(@Param('id') id: string) {
    return this.loaicongtrinhcsvcService.remove(id);
  }
}
