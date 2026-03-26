import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhgdhtService } from './phgdht.service';
import { CreatePhgdhtDto } from './dto/create-phgdht.dto';
import { UpdatePhgdhtDto } from './dto/update-phgdht.dto';

@Controller('phgdht')
export class PhgdhtController {
  constructor(private readonly phgdhtService: PhgdhtService) {}

  @Post()
  create(@Body() createPhgdhtDto: CreatePhgdhtDto) {
    return this.phgdhtService.create(createPhgdhtDto);
  }

  @Get()
  findAll() {
    return this.phgdhtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phgdhtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhgdhtDto: UpdatePhgdhtDto) {
    return this.phgdhtService.update(+id, updatePhgdhtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phgdhtService.remove(+id);
  }
}
