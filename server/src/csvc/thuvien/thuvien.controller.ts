import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ThuvienService } from './thuvien.service';
import { CreateThuvienDto } from './dto/create-thuvien.dto';
import { UpdateThuvienDto } from './dto/update-thuvien.dto';

@Controller('thuvien')
export class ThuvienController {
  constructor(private readonly thuvienService: ThuvienService) {}

  @Post()
  create(@Body() createThuvienDto: CreateThuvienDto) {
    return this.thuvienService.create(createThuvienDto);
  }

  @Get()
  findAll() {
    return this.thuvienService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thuvienService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThuvienDto: UpdateThuvienDto) {
    return this.thuvienService.update(+id, updateThuvienDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thuvienService.remove(+id);
  }
}
