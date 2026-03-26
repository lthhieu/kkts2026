import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ResponseMessage } from 'src/configs/my.decorator';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) { }

  @Post()
  @ResponseMessage('Tạo nước thành công')
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo nước thành công')
  createMany(@Body() createCountryDto: CreateCountryDto[]) {
    return this.countriesService.createMany(createCountryDto);
  }

  @Get()
  @ResponseMessage('Tải nước thành công')
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.countriesService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin nước thành công')
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật nước thành công')
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countriesService.update(id, updateCountryDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa nước thành công')
  removeMany(@Body() ids: any[]) {
    return this.countriesService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa nước thành công')
  remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}
