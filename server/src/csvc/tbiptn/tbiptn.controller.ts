import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TbiptnService } from './tbiptn.service';
import { CreateTbiptnDto } from './dto/create-tbiptn.dto';
import { UpdateTbiptnDto } from './dto/update-tbiptn.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('tbiptn')
export class TbiptnController {
  constructor(private readonly tbiptnService: TbiptnService) {}

  @Post()
  @ResponseMessage('Tạo thiết bị PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createTbiptnDto: CreateTbiptnDto) {
    return this.tbiptnService.create(createTbiptnDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo thiết bị PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createTbiptnDto: CreateTbiptnDto[]) {
    return this.tbiptnService.createMany(createTbiptnDto);
  }

  @Get()
  @ResponseMessage('Tải thiết bị PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.tbiptnService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin thiết bị PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.tbiptnService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thiết bị PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateTbiptnDto: UpdateTbiptnDto) {
    return this.tbiptnService.update(id, updateTbiptnDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa thiết bị PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.tbiptnService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa thiết bị PTN thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.tbiptnService.remove(id);
  }
}
