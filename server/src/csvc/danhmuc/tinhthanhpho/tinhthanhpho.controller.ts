import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TinhthanhphoService } from './tinhthanhpho.service';
import { CreateTinhthanhphoDto } from './dto/create-tinhthanhpho.dto';
import { UpdateTinhthanhphoDto } from './dto/update-tinhthanhpho.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('tinhthanhpho')
export class TinhthanhphoController {
  constructor(private readonly tinhthanhphoService: TinhthanhphoService) { }

  @Post()
  @ResponseMessage('Tạo tỉnh thành phố thành công')
  create(@Body() createTinhthanhphoDto: CreateTinhthanhphoDto) {
    return this.tinhthanhphoService.create(createTinhthanhphoDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo tỉnh thành phố thành công')
  createMany(@Body() createTinhthanhphoDto: CreateTinhthanhphoDto[]) {
    return this.tinhthanhphoService.createMany(createTinhthanhphoDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách tỉnh thành phố thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.tinhthanhphoService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin tỉnh thành phố thành công')
  findOne(@Param('id') id: string) {
    return this.tinhthanhphoService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tỉnh thành phố thành công')
  update(@Param('id') id: string, @Body() updateTinhthanhphoDto: UpdateTinhthanhphoDto) {
    return this.tinhthanhphoService.update(id, updateTinhthanhphoDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa tỉnh thành phố thành công')
  removeMany(@Body() ids: any[]) {
    return this.tinhthanhphoService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tỉnh thành phố thành công')
  remove(@Param('id') id: string) {
    return this.tinhthanhphoService.remove(id);
  }
}
