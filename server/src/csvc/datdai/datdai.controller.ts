import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatdaiService } from './datdai.service';
import { CreateDatdaiDto } from './dto/create-datdai.dto';
import { UpdateDatdaiDto } from './dto/update-datdai.dto';

@Controller('datdai')
export class DatdaiController {
  constructor(private readonly datdaiService: DatdaiService) {}

  @Post()
  create(@Body() createDatdaiDto: CreateDatdaiDto) {
    return this.datdaiService.create(createDatdaiDto);
  }

  @Get()
  findAll() {
    return this.datdaiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.datdaiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatdaiDto: UpdateDatdaiDto) {
    return this.datdaiService.update(+id, updateDatdaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.datdaiService.remove(+id);
  }
}
