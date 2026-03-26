import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MucdichsudungcsvcService } from './mucdichsudungcsvc.service';
import { CreateMucdichsudungcsvcDto } from './dto/create-mucdichsudungcsvc.dto';
import { UpdateMucdichsudungcsvcDto } from './dto/update-mucdichsudungcsvc.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('mucdichsudungcsvc')
export class MucdichsudungcsvcController {
  constructor(private readonly mucdichsudungcsvcService: MucdichsudungcsvcService) { }

  @Post()
  @ResponseMessage('Tạo mục đích sử dụng CSVC thành công')
  create(@Body() createMucdichsudungcsvcDto: CreateMucdichsudungcsvcDto) {
    return this.mucdichsudungcsvcService.create(createMucdichsudungcsvcDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo mục đích sử dụng CSVC thành công')
  createMany(@Body() createMucdichsudungcsvcDto: CreateMucdichsudungcsvcDto[]) {
    return this.mucdichsudungcsvcService.createMany(createMucdichsudungcsvcDto);
  }

  @Get()
  @ResponseMessage('Tải mục đích sử dụng CSVC thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.mucdichsudungcsvcService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin mục đích sử dụng CSVC thành công')
  findOne(@Param('id') id: string) {
    return this.mucdichsudungcsvcService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật mục đích sử dụng CSVC thành công')
  update(@Param('id') id: string, @Body() updateMucdichsudungcsvcDto: UpdateMucdichsudungcsvcDto) {
    return this.mucdichsudungcsvcService.update(id, updateMucdichsudungcsvcDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa mục đích sử dụng CSVC thành công')
  removeMany(@Body() ids: any[]) {
    return this.mucdichsudungcsvcService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa mục đích sử dụng CSVC thành công')
  remove(@Param('id') id: string) {
    return this.mucdichsudungcsvcService.remove(id);
  }
}
