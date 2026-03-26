import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PhanloaiService } from './phanloai.service';
import { CreatePhanloaiDto } from './dto/create-phanloai.dto';
import { UpdatePhanloaiDto } from './dto/update-phanloai.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('phanloai')
export class PhanloaiController {
  constructor(private readonly phanloaiService: PhanloaiService) { }

  @Post()
  @ResponseMessage('Tạo phân loại thành công')
  create(@Body() createPhanloaiDto: CreatePhanloaiDto) {
    return this.phanloaiService.create(createPhanloaiDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo phân loại thành công')
  createMany(@Body() createPhanloaiDto: CreatePhanloaiDto[]) {
    return this.phanloaiService.createMany(createPhanloaiDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách phân loại thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.phanloaiService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin phân loại thành công')
  findOne(@Param('id') id: string) {
    return this.phanloaiService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật phân loại thành công')
  update(@Param('id') id: string, @Body() updatePhanloaiDto: UpdatePhanloaiDto) {
    return this.phanloaiService.update(id, updatePhanloaiDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa phân loại thành công')
  removeMany(@Body() ids: any[]) {
    return this.phanloaiService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa phân loại thành công')
  remove(@Param('id') id: string) {
    return this.phanloaiService.remove(id);
  }
}
