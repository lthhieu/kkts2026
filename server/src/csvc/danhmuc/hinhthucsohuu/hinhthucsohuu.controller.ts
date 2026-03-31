import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { HinhthucsohuuService } from './hinhthucsohuu.service';
import { CreateHinhthucsohuuDto } from './dto/create-hinhthucsohuu.dto';
import { UpdateHinhthucsohuuDto } from './dto/update-hinhthucsohuu.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('hinhthucsohuu')
export class HinhthucsohuuController {
  constructor(private readonly hinhthucsohuuService: HinhthucsohuuService) { }

  @Post()
  @ResponseMessage('Tạo hình thức sở hữu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createHinhthucsohuuDto: CreateHinhthucsohuuDto) {
    return this.hinhthucsohuuService.create(createHinhthucsohuuDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo hình thức sở hữu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createHinhthucsohuuDto: CreateHinhthucsohuuDto[]) {
    return this.hinhthucsohuuService.createMany(createHinhthucsohuuDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách hình thức sở hữu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.hinhthucsohuuService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin hình thức sở hữu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.hinhthucsohuuService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật hình thức sở hữu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateHinhthucsohuuDto: UpdateHinhthucsohuuDto) {
    return this.hinhthucsohuuService.update(id, updateHinhthucsohuuDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa hình thức sở hữu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.hinhthucsohuuService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa hình thức sở hữu thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.hinhthucsohuuService.remove(id);
  }
}
