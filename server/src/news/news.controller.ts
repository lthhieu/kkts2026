import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';

import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { Action, NewsSubject } from 'src/configs/enum';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  @ResponseMessage('Tạo tin tức thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, NewsSubject))
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách tin tức thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, NewsSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.newsService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin tin tức thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, NewsSubject))
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tin tức thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, NewsSubject))
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tin tức thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, NewsSubject))
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
