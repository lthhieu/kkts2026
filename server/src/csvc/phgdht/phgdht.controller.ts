import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PhgdhtService } from './phgdht.service';
import { CreatePhgdhtDto } from './dto/create-phgdht.dto';
import { UpdatePhgdhtDto } from './dto/update-phgdht.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('phgdht')
export class PhgdhtController {
  constructor(private readonly phgdhtService: PhgdhtService) {}

  @Post()
  @ResponseMessage('Tạo phòng GDHT thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createPhgdhtDto: CreatePhgdhtDto) {
    return this.phgdhtService.create(createPhgdhtDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo phòng GDHT thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createPhgdhtDto: CreatePhgdhtDto[]) {
    return this.phgdhtService.createMany(createPhgdhtDto);
  }

  @Get()
  @ResponseMessage('Tải phòng GDHT thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.phgdhtService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin phòng GDHT thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.phgdhtService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật phòng GDHT thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updatePhgdhtDto: UpdatePhgdhtDto) {
    return this.phgdhtService.update(id, updatePhgdhtDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa phòng GDHT thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.phgdhtService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa phòng GDHT thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.phgdhtService.remove(id);
  }
}
