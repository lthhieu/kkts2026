import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, UseGuards } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, UnitSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) { }

  @Post()
  @ResponseMessage('Tạo đơn vị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, UnitSubject))
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo đơn vị thành công')
  createMany(@Body() createUnitDto: CreateUnitDto[]) {
    return this.unitsService.createMany(createUnitDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách đơn vị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UnitSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.unitsService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin đơn vị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UnitSubject))
  findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật đơn vị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, UnitSubject))
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(id, updateUnitDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa đơn vị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, UnitSubject))
  removeMany(@Body() ids: any[]) {
    return this.unitsService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa đơn vị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, UnitSubject))
  remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
