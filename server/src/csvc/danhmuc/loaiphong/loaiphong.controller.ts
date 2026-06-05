import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LoaiphongService } from './loaiphong.service';
import { CreateLoaiphongDto } from './dto/create-loaiphong.dto';
import { UpdateLoaiphongDto } from './dto/update-loaiphong.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('loaiphong')
export class LoaiphongController {
  constructor(private readonly loaiphongService: LoaiphongService) { }

  @Post()
  @ResponseMessage('Tạo loại phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createLoaiphongDto: CreateLoaiphongDto) {
    return this.loaiphongService.create(createLoaiphongDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo loại phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createLoaiphongDto: CreateLoaiphongDto[]) {
    return this.loaiphongService.createMany(createLoaiphongDto);
  }

  @Get()
  @ResponseMessage('Tải loại phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.loaiphongService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin loại phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.loaiphongService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật loại phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateLoaiphongDto: UpdateLoaiphongDto) {
    return this.loaiphongService.update(id, updateLoaiphongDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa loại phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.loaiphongService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa loại phòng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.loaiphongService.remove(id);
  }
}
