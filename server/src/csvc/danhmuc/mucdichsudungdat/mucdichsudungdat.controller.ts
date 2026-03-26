import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MucdichsudungdatService } from './mucdichsudungdat.service';
import { CreateMucdichsudungdatDto } from './dto/create-mucdichsudungdat.dto';
import { UpdateMucdichsudungdatDto } from './dto/update-mucdichsudungdat.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('mucdichsudungdat')
export class MucdichsudungdatController {
  constructor(private readonly mucdichsudungdatService: MucdichsudungdatService) { }

  @Post()
  @ResponseMessage('Tạo mục đích sử dụng đất thành công')
  create(@Body() createMucdichsudungdatDto: CreateMucdichsudungdatDto) {
    return this.mucdichsudungdatService.create(createMucdichsudungdatDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo mục đích sử dụng đất thành công')
  createMany(@Body() createMucdichsudungdatDto: CreateMucdichsudungdatDto[]) {
    return this.mucdichsudungdatService.createMany(createMucdichsudungdatDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách mục đích sử dụng đất thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.mucdichsudungdatService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin mục đích sử dụng đất thành công')
  findOne(@Param('id') id: string) {
    return this.mucdichsudungdatService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật mục đích sử dụng đất thành công')
  update(@Param('id') id: string, @Body() updateMucdichsudungdatDto: UpdateMucdichsudungdatDto) {
    return this.mucdichsudungdatService.update(id, updateMucdichsudungdatDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa mục đích sử dụng đất thành công')
  removeMany(@Body() ids: any[]) {
    return this.mucdichsudungdatService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa mục đích sử dụng đất thành công')
  remove(@Param('id') id: string) {
    return this.mucdichsudungdatService.remove(id);
  }
}
