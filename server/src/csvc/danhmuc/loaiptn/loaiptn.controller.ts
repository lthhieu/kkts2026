import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LoaiptnService } from './loaiptn.service';
import { CreateLoaiptnDto } from './dto/create-loaiptn.dto';
import { UpdateLoaiptnDto } from './dto/update-loaiptn.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('loaiptn')
export class LoaiptnController {
  constructor(private readonly loaiptnService: LoaiptnService) { }

  @Post()
  @ResponseMessage('Tạo loại phòng thí nghiệm thành công')
  create(@Body() createLoaiptnDto: CreateLoaiptnDto) {
    return this.loaiptnService.create(createLoaiptnDto);
  }
  @Post('/create-many')
  @ResponseMessage('Tạo loại phòng thí nghiệ thành công')
  createMany(@Body() createLoaiptnDto: CreateLoaiptnDto[]) {
    return this.loaiptnService.createMany(createLoaiptnDto);
  }

  @Get()
  @ResponseMessage('Tải loại phòng thí nghiệm thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.loaiptnService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin loại phòng thí nghiệ thành công')
  findOne(@Param('id') id: string) {
    return this.loaiptnService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật loại phòng thí nghiệ thành công')
  update(@Param('id') id: string, @Body() updateLoaiptnDto: UpdateLoaiptnDto) {
    return this.loaiptnService.update(id, updateLoaiptnDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa loại phòng thí nghiệ thành công')
  removeMany(@Body() ids: any[]) {
    return this.loaiptnService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa loại phòng thí nghiệ thành công')
  remove(@Param('id') id: string) {
    return this.loaiptnService.remove(id);
  }
}
