import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { XthService } from './xth.service';
import { CreateXthDto } from './dto/create-xth.dto';
import { UpdateXthDto } from './dto/update-xth.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('xth')
export class XthController {
  constructor(private readonly xthService: XthService) {}

  @Post()
  @ResponseMessage('Tạo xưởng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createXthDto: CreateXthDto) {
    return this.xthService.create(createXthDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo xưởng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createXthDto: CreateXthDto[]) {
    return this.xthService.createMany(createXthDto);
  }

  @Get()
  @ResponseMessage('Tải xưởng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.xthService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin xưởng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.xthService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật xưởng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateXthDto: UpdateXthDto) {
    return this.xthService.update(id, updateXthDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa xưởng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.xthService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa xưởng thực hành thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.xthService.remove(id);
  }
}
