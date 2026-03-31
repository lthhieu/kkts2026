import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ToanhaService } from './toanha.service';
import { CreateToanhaDto } from './dto/create-toanha.dto';
import { UpdateToanhaDto } from './dto/update-toanha.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('toanha')
export class ToanhaController {
  constructor(private readonly toanhaService: ToanhaService) {}

  @Post()
  @ResponseMessage('Tạo toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createToanhaDto: CreateToanhaDto) {
    return this.toanhaService.create(createToanhaDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createToanhaDto: CreateToanhaDto[]) {
    return this.toanhaService.createMany(createToanhaDto);
  }

  @Get()
  @ResponseMessage('Tải toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.toanhaService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.toanhaService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateToanhaDto: UpdateToanhaDto) {
    return this.toanhaService.update(id, updateToanhaDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.toanhaService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa toà nhà thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.toanhaService.remove(id);
  }
}
