import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LinhvucdaotaoService } from './linhvucdaotao.service';
import { CreateLinhvucdaotaoDto } from './dto/create-linhvucdaotao.dto';
import { UpdateLinhvucdaotaoDto } from './dto/update-linhvucdaotao.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('linhvucdaotao')
export class LinhvucdaotaoController {
  constructor(private readonly linhvucdaotaoService: LinhvucdaotaoService) { }

  @Post()
  @ResponseMessage('Tạo lĩnh vực đào tạo thành công')
  create(@Body() createLinhvucdaotaoDto: CreateLinhvucdaotaoDto) {
    return this.linhvucdaotaoService.create(createLinhvucdaotaoDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo lĩnh vực đào tạo thành công')
  createMany(@Body() createLinhvucdaotaoDto: CreateLinhvucdaotaoDto[]) {
    return this.linhvucdaotaoService.createMany(createLinhvucdaotaoDto);
  }

  @Get()
  @ResponseMessage('Tải lĩnh vực đào tạo thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.linhvucdaotaoService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin lĩnh vực đào tạo thành công')
  findOne(@Param('id') id: string) {
    return this.linhvucdaotaoService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật lĩnh vực đào tạo thành công')
  update(@Param('id') id: string, @Body() updateLinhvucdaotaoDto: UpdateLinhvucdaotaoDto) {
    return this.linhvucdaotaoService.update(id, updateLinhvucdaotaoDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa lĩnh vực đào tạo thành công')
  removeMany(@Body() ids: any[]) {
    return this.linhvucdaotaoService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa lĩnh vực đào tạo thành công')
  remove(@Param('id') id: string) {
    return this.linhvucdaotaoService.remove(id);
  }
}
