import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CtkService } from './ctk.service';
import { CreateCtkDto } from './dto/create-ctk.dto';
import { UpdateCtkDto } from './dto/update-ctk.dto';

@Controller('ctk')
export class CtkController {
  constructor(private readonly ctkService: CtkService) {}

  @Post()
  create(@Body() createCtkDto: CreateCtkDto) {
    return this.ctkService.create(createCtkDto);
  }

  @Get()
  findAll() {
    return this.ctkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ctkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCtkDto: UpdateCtkDto) {
    return this.ctkService.update(+id, updateCtkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ctkService.remove(+id);
  }
}
