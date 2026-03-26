import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LoaideanService } from './loaidean.service';
import { CreateLoaideanDto } from './dto/create-loaidean.dto';
import { UpdateLoaideanDto } from './dto/update-loaidean.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('loaidean')
export class LoaideanController {
  constructor(private readonly loaideanService: LoaideanService) { }

  @Post()
  @ResponseMessage('Tạo loại đề án thành công')
  create(@Body() createLoaideanDto: CreateLoaideanDto) {
    return this.loaideanService.create(createLoaideanDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo loại đề án thành công')
  createMany(@Body() createLoaideanDto: CreateLoaideanDto[]) {
    return this.loaideanService.createMany(createLoaideanDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách loại đề án thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.loaideanService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin loại đề án thành công')
  findOne(@Param('id') id: string) {
    return this.loaideanService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật loại đề án thành công')
  update(@Param('id') id: string, @Body() updateLoaideanDto: UpdateLoaideanDto) {
    return this.loaideanService.update(id, updateLoaideanDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa loại đề án thành công')
  removeMany(@Body() ids: any[]) {
    return this.loaideanService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa loại đề án thành công')
  remove(@Param('id') id: string) {
    return this.loaideanService.remove(id);
  }
}
