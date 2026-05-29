import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { ThuchanhService } from 'src/csvc/thuchanh/thuchanh.service';
import { CreateThuchanhDto } from 'src/csvc/thuchanh/dto/create-thuchanh.dto';
import { UpdateThuchanhDto } from 'src/csvc/thuchanh/dto/update-thuchanh.dto';

@UseGuards(PoliciesGuard)
@Controller('thuchanh')
export class ThuchanhController {
  constructor(private readonly thuchanhService: ThuchanhService) { }

  @Post()
  @ResponseMessage('Tạo phòng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createThuchanhDto: CreateThuchanhDto) {
    return this.thuchanhService.create(createThuchanhDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo phòng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createThuchanhDto: CreateThuchanhDto[]) {
    return this.thuchanhService.createMany(createThuchanhDto);
  }

  @Get()
  @ResponseMessage('Tải phòng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.thuchanhService.findAll(+current, +pageSize, queryString);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.thuchanhService.summary();
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin phòng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.thuchanhService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật phòng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateThuchanhDto: UpdateThuchanhDto) {
    return this.thuchanhService.update(id, updateThuchanhDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa phòng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.thuchanhService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa phòng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.thuchanhService.remove(id);
  }
}
