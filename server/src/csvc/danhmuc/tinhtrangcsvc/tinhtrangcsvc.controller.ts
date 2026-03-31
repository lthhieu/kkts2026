import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TinhtrangcsvcService } from './tinhtrangcsvc.service';
import { CreateTinhtrangcsvcDto } from './dto/create-tinhtrangcsvc.dto';
import { UpdateTinhtrangcsvcDto } from './dto/update-tinhtrangcsvc.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('tinhtrangcsvc')
export class TinhtrangcsvcController {
  constructor(private readonly tinhtrangcsvcService: TinhtrangcsvcService) { }

  @Post()
  @ResponseMessage('Tạo tình trạng csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createTinhtrangcsvcDto: CreateTinhtrangcsvcDto) {
    return this.tinhtrangcsvcService.create(createTinhtrangcsvcDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo tình trạng csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createTinhtrangcsvcDto: CreateTinhtrangcsvcDto[]) {
    return this.tinhtrangcsvcService.createMany(createTinhtrangcsvcDto);
  }

  @Get()
  @ResponseMessage('Tải tình trạng csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.tinhtrangcsvcService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin tình trạng csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.tinhtrangcsvcService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tình trạng csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateTinhtrangcsvcDto: UpdateTinhtrangcsvcDto) {
    return this.tinhtrangcsvcService.update(id, updateTinhtrangcsvcDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa tình trạng csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.tinhtrangcsvcService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tình trạng csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.tinhtrangcsvcService.remove(id);
  }
}
