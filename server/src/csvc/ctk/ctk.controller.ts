import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CtkService } from './ctk.service';
import { CreateCtkDto } from './dto/create-ctk.dto';
import { UpdateCtkDto } from './dto/update-ctk.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('ctk')
export class CtkController {
  constructor(private readonly ctkService: CtkService) {}

  @Post()
  @ResponseMessage('Tạo công trình thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createCtkDto: CreateCtkDto) {
    return this.ctkService.create(createCtkDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo công trình thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createCtkDto: CreateCtkDto[]) {
    return this.ctkService.createMany(createCtkDto);
  }

  @Get()
  @ResponseMessage('Tải công trình thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.ctkService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin công trình thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.ctkService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật công trình thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateCtkDto: UpdateCtkDto) {
    return this.ctkService.update(id, updateCtkDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa công trình thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.ctkService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa công trình thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.ctkService.remove(id);
  }
}
