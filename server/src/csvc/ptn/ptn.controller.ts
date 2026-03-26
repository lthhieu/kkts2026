import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PtnService } from './ptn.service';
import { CreatePtnDto } from './dto/create-ptn.dto';
import { UpdatePtnDto } from './dto/update-ptn.dto';

@Controller('ptn')
export class PtnController {
  constructor(private readonly ptnService: PtnService) {}

  @Post()
  create(@Body() createPtnDto: CreatePtnDto) {
    return this.ptnService.create(createPtnDto);
  }

  @Get()
  findAll() {
    return this.ptnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ptnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePtnDto: UpdatePtnDto) {
    return this.ptnService.update(+id, updatePtnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ptnService.remove(+id);
  }
}
