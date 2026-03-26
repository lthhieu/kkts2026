import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KtxService } from './ktx.service';
import { CreateKtxDto } from './dto/create-ktx.dto';
import { UpdateKtxDto } from './dto/update-ktx.dto';

@Controller('ktx')
export class KtxController {
  constructor(private readonly ktxService: KtxService) {}

  @Post()
  create(@Body() createKtxDto: CreateKtxDto) {
    return this.ktxService.create(createKtxDto);
  }

  @Get()
  findAll() {
    return this.ktxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ktxService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKtxDto: UpdateKtxDto) {
    return this.ktxService.update(+id, updateKtxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ktxService.remove(+id);
  }
}
