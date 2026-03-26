import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { XthService } from './xth.service';
import { CreateXthDto } from './dto/create-xth.dto';
import { UpdateXthDto } from './dto/update-xth.dto';

@Controller('xth')
export class XthController {
  constructor(private readonly xthService: XthService) {}

  @Post()
  create(@Body() createXthDto: CreateXthDto) {
    return this.xthService.create(createXthDto);
  }

  @Get()
  findAll() {
    return this.xthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.xthService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateXthDto: UpdateXthDto) {
    return this.xthService.update(+id, updateXthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.xthService.remove(+id);
  }
}
