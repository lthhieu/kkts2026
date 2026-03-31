import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TinhtrangsudungService } from './tinhtrangsudung.service';
import { CreateTinhtrangsudungDto } from './dto/create-tinhtrangsudung.dto';
import { UpdateTinhtrangsudungDto } from './dto/update-tinhtrangsudung.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('tinhtrangsudung')
export class TinhtrangsudungController {
  constructor(private readonly tinhtrangsudungService: TinhtrangsudungService) { }

  @Post()
  @ResponseMessage('Tạo tình trạng sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createTinhtrangsudungDto: CreateTinhtrangsudungDto) {
    return this.tinhtrangsudungService.create(createTinhtrangsudungDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo tình trạng sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createTinhtrangsudungDto: CreateTinhtrangsudungDto[]) {
    return this.tinhtrangsudungService.createMany(createTinhtrangsudungDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách tình trạng sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.tinhtrangsudungService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin tình trạng sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.tinhtrangsudungService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tình trạng sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateTinhtrangsudungDto: UpdateTinhtrangsudungDto) {
    return this.tinhtrangsudungService.update(id, updateTinhtrangsudungDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa tình trạng sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.tinhtrangsudungService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tình trạng sử dụng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.tinhtrangsudungService.remove(id);
  }
}
