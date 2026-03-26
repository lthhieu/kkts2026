import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LuachonService } from './luachon.service';
import { CreateLuachonDto } from './dto/create-luachon.dto';
import { UpdateLuachonDto } from './dto/update-luachon.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('luachon')
export class LuachonController {
  constructor(private readonly luachonService: LuachonService) { }

  @Post()
  @ResponseMessage('Tạo lựa chọn thành công')
  create(@Body() createLuachonDto: CreateLuachonDto) {
    return this.luachonService.create(createLuachonDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo lựa chọn thành công')
  createMany(@Body() createLuachonDto: CreateLuachonDto[]) {
    return this.luachonService.createMany(createLuachonDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách lựa chọn thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.luachonService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin lựa chọn thành công')
  findOne(@Param('id') id: string) {
    return this.luachonService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật lựa chọn thành công')
  update(@Param('id') id: string, @Body() updateLuachonDto: UpdateLuachonDto) {
    return this.luachonService.update(id, updateLuachonDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa lựa chọn thành công')
  removeMany(@Body() ids: any[]) {
    return this.luachonService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa lựa chọn thành công')
  remove(@Param('id') id: string) {
    return this.luachonService.remove(id);
  }
}
