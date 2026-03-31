import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ThuvienService } from './thuvien.service';
import { CreateThuvienDto } from './dto/create-thuvien.dto';
import { UpdateThuvienDto } from './dto/update-thuvien.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('thuvien')
export class ThuvienController {
  constructor(private readonly thuvienService: ThuvienService) {}

  @Post()
  @ResponseMessage('Tạo thư viện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createThuvienDto: CreateThuvienDto) {
    return this.thuvienService.create(createThuvienDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo thư viện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createThuvienDto: CreateThuvienDto[]) {
    return this.thuvienService.createMany(createThuvienDto);
  }

  @Get()
  @ResponseMessage('Tải thư viện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.thuvienService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin thư viện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.thuvienService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thư viện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateThuvienDto: UpdateThuvienDto) {
    return this.thuvienService.update(id, updateThuvienDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa thư viện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.thuvienService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa thư viện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.thuvienService.remove(id);
  }
}
