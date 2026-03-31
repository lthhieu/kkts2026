import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TinhthanhphoService } from './tinhthanhpho.service';
import { CreateTinhthanhphoDto } from './dto/create-tinhthanhpho.dto';
import { UpdateTinhthanhphoDto } from './dto/update-tinhthanhpho.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('tinhthanhpho')
export class TinhthanhphoController {
  constructor(private readonly tinhthanhphoService: TinhthanhphoService) { }

  @Post()
  @ResponseMessage('Tạo tỉnh thành phố thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createTinhthanhphoDto: CreateTinhthanhphoDto) {
    return this.tinhthanhphoService.create(createTinhthanhphoDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo tỉnh thành phố thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createTinhthanhphoDto: CreateTinhthanhphoDto[]) {
    return this.tinhthanhphoService.createMany(createTinhthanhphoDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách tỉnh thành phố thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.tinhthanhphoService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin tỉnh thành phố thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.tinhthanhphoService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tỉnh thành phố thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateTinhthanhphoDto: UpdateTinhthanhphoDto) {
    return this.tinhthanhphoService.update(id, updateTinhthanhphoDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa tỉnh thành phố thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.tinhthanhphoService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tỉnh thành phố thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.tinhthanhphoService.remove(id);
  }
}
