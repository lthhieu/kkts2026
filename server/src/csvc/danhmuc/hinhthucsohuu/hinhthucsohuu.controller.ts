import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HinhthucsohuuService } from './hinhthucsohuu.service';
import { CreateHinhthucsohuuDto } from './dto/create-hinhthucsohuu.dto';
import { UpdateHinhthucsohuuDto } from './dto/update-hinhthucsohuu.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('hinhthucsohuu')
export class HinhthucsohuuController {
  constructor(private readonly hinhthucsohuuService: HinhthucsohuuService) { }

  @Post()
  @ResponseMessage('Tạo hình thức sở hữu thành công')
  create(@Body() createHinhthucsohuuDto: CreateHinhthucsohuuDto) {
    return this.hinhthucsohuuService.create(createHinhthucsohuuDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo hình thức sở hữu thành công')
  createMany(@Body() createHinhthucsohuuDto: CreateHinhthucsohuuDto[]) {
    return this.hinhthucsohuuService.createMany(createHinhthucsohuuDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách hình thức sở hữu thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.hinhthucsohuuService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin hình thức sở hữu thành công')
  findOne(@Param('id') id: string) {
    return this.hinhthucsohuuService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật hình thức sở hữu thành công')
  update(@Param('id') id: string, @Body() updateHinhthucsohuuDto: UpdateHinhthucsohuuDto) {
    return this.hinhthucsohuuService.update(id, updateHinhthucsohuuDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa hình thức sở hữu thành công')
  removeMany(@Body() ids: any[]) {
    return this.hinhthucsohuuService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa hình thức sở hữu thành công')
  remove(@Param('id') id: string) {
    return this.hinhthucsohuuService.remove(id);
  }
}
