import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PtnService } from './ptn.service';
import { CreatePtnDto } from './dto/create-ptn.dto';
import { UpdatePtnDto } from './dto/update-ptn.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('ptn')
export class PtnController {
  constructor(private readonly ptnService: PtnService) {}

  @Post()
  @ResponseMessage('Tạo PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createPtnDto: CreatePtnDto) {
    return this.ptnService.create(createPtnDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createPtnDto: CreatePtnDto[]) {
    return this.ptnService.createMany(createPtnDto);
  }

  @Get()
  @ResponseMessage('Tải PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.ptnService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.ptnService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updatePtnDto: UpdatePtnDto) {
    return this.ptnService.update(id, updatePtnDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.ptnService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.ptnService.remove(id);
  }
}
