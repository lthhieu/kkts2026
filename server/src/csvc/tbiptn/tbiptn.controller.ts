import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TbiptnService } from './tbiptn.service';
import { CreateTbiptnDto } from './dto/create-tbiptn.dto';
import { UpdateTbiptnDto } from './dto/update-tbiptn.dto';

@Controller('tbiptn')
export class TbiptnController {
  constructor(private readonly tbiptnService: TbiptnService) {}

  @Post()
  create(@Body() createTbiptnDto: CreateTbiptnDto) {
    return this.tbiptnService.create(createTbiptnDto);
  }

  @Get()
  findAll() {
    return this.tbiptnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tbiptnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTbiptnDto: UpdateTbiptnDto) {
    return this.tbiptnService.update(+id, updateTbiptnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tbiptnService.remove(+id);
  }
}
