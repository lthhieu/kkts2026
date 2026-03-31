import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LoaiptnService } from './loaiptn.service';
import { CreateLoaiptnDto } from './dto/create-loaiptn.dto';
import { UpdateLoaiptnDto } from './dto/update-loaiptn.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('loaiptn')
export class LoaiptnController {
  constructor(private readonly loaiptnService: LoaiptnService) { }

  @Post()
  @ResponseMessage('Tạo loại phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createLoaiptnDto: CreateLoaiptnDto) {
    return this.loaiptnService.create(createLoaiptnDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo loại phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createLoaiptnDto: CreateLoaiptnDto[]) {
    return this.loaiptnService.createMany(createLoaiptnDto);
  }

  @Get()
  @ResponseMessage('Tải loại phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.loaiptnService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin loại phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.loaiptnService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật loại phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateLoaiptnDto: UpdateLoaiptnDto) {
    return this.loaiptnService.update(id, updateLoaiptnDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa loại phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.loaiptnService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa loại phòng thí nghiệm thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.loaiptnService.remove(id);
  }
}
