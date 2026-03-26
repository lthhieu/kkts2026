import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TinhtrangsudungService } from './tinhtrangsudung.service';
import { CreateTinhtrangsudungDto } from './dto/create-tinhtrangsudung.dto';
import { UpdateTinhtrangsudungDto } from './dto/update-tinhtrangsudung.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('tinhtrangsudung')
export class TinhtrangsudungController {
  constructor(private readonly tinhtrangsudungService: TinhtrangsudungService) { }

  @Post()
  @ResponseMessage('Tạo tình trạng sử dụng thành công')
  create(@Body() createTinhtrangsudungDto: CreateTinhtrangsudungDto) {
    return this.tinhtrangsudungService.create(createTinhtrangsudungDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo tình trạng sử dụng thành công')
  createMany(@Body() createTinhtrangsudungDto: CreateTinhtrangsudungDto[]) {
    return this.tinhtrangsudungService.createMany(createTinhtrangsudungDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách tình trạng sử dụng thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.tinhtrangsudungService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin tình trạng sử dụng thành công')
  findOne(@Param('id') id: string) {
    return this.tinhtrangsudungService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tình trạng sử dụng thành công')
  update(@Param('id') id: string, @Body() updateTinhtrangsudungDto: UpdateTinhtrangsudungDto) {
    return this.tinhtrangsudungService.update(id, updateTinhtrangsudungDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa tình trạng sử dụng thành công')
  removeMany(@Body() ids: any[]) {
    return this.tinhtrangsudungService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tình trạng sử dụng thành công')
  remove(@Param('id') id: string) {
    return this.tinhtrangsudungService.remove(id);
  }
}
