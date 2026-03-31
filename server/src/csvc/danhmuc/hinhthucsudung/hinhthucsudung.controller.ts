import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { HinhthucsudungService } from './hinhthucsudung.service';
import { CreateHinhthucsudungDto } from './dto/create-hinhthucsudung.dto';
import { UpdateHinhthucsudungDto } from './dto/update-hinhthucsudung.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('hinhthucsudung')
export class HinhthucsudungController {
  constructor(private readonly hinhthucsudungService: HinhthucsudungService) { }

  @Post()
  @ResponseMessage('Tạo hình thức sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createHinhthucsudungDto: CreateHinhthucsudungDto) {
    return this.hinhthucsudungService.create(createHinhthucsudungDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo hình thức sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createHinhthucsudungDto: CreateHinhthucsudungDto[]) {
    return this.hinhthucsudungService.createMany(createHinhthucsudungDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách hình thức sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.hinhthucsudungService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin hình thức sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.hinhthucsudungService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật hình thức sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateHinhthucsudungDto: UpdateHinhthucsudungDto) {
    return this.hinhthucsudungService.update(id, updateHinhthucsudungDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa hình thức sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.hinhthucsudungService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa hình thức sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.hinhthucsudungService.remove(id);
  }
}
