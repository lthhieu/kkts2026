import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToanhaService } from './toanha.service';
import { CreateToanhaDto } from './dto/create-toanha.dto';
import { UpdateToanhaDto } from './dto/update-toanha.dto';

@Controller('toanha')
export class ToanhaController {
  constructor(private readonly toanhaService: ToanhaService) {}

  @Post()
  create(@Body() createToanhaDto: CreateToanhaDto) {
    return this.toanhaService.create(createToanhaDto);
  }

  @Get()
  findAll() {
    return this.toanhaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toanhaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToanhaDto: UpdateToanhaDto) {
    return this.toanhaService.update(+id, updateToanhaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toanhaService.remove(+id);
  }
}
