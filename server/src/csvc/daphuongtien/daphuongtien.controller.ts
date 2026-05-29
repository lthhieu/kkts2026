import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { DaphuongtienService } from 'src/csvc/daphuongtien/daphuongtien.service';
import { CreateDaphuongtienDto } from 'src/csvc/daphuongtien/dto/create-daphuongtien.dto';
import { UpdateDaphuongtienDto } from 'src/csvc/daphuongtien/dto/update-daphuongtien.dto';
@UseGuards(PoliciesGuard)
@Controller('daphuongtien')
export class DaphuongtienController {
  constructor(private readonly daphuongtienService: DaphuongtienService) { }

  @Post()
  @ResponseMessage('Tạo đa phương tiện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createDaphuongtienDto: CreateDaphuongtienDto) {
    return this.daphuongtienService.create(createDaphuongtienDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo đa phương tiện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createDaphuongtienDto: CreateDaphuongtienDto[]) {
    return this.daphuongtienService.createMany(createDaphuongtienDto);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan đa phương tiện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.daphuongtienService.summary();
  }

  @Get()
  @ResponseMessage('Tải đa phương tiện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.daphuongtienService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin đa phương tiện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.daphuongtienService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật đa phương tiện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateDaphuongtienDto: UpdateDaphuongtienDto) {
    return this.daphuongtienService.update(id, updateDaphuongtienDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa đa phương tiện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.daphuongtienService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa đa phương tiện thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.daphuongtienService.remove(id);
  }
}
