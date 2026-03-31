import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LoaicongtrinhcsvcService } from './loaicongtrinhcsvc.service';
import { CreateLoaicongtrinhcsvcDto } from './dto/create-loaicongtrinhcsvc.dto';
import { UpdateLoaicongtrinhcsvcDto } from './dto/update-loaicongtrinhcsvc.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('loaicongtrinhcsvc')
export class LoaicongtrinhcsvcController {
  constructor(private readonly loaicongtrinhcsvcService: LoaicongtrinhcsvcService) { }

  @Post()
  @ResponseMessage('Tạo loại công trình csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createLoaicongtrinhcsvcDto: CreateLoaicongtrinhcsvcDto) {
    return this.loaicongtrinhcsvcService.create(createLoaicongtrinhcsvcDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo loại công trình csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createLoaicongtrinhcsvcDto: CreateLoaicongtrinhcsvcDto[]) {
    return this.loaicongtrinhcsvcService.createMany(createLoaicongtrinhcsvcDto);
  }

  @Get()
  @ResponseMessage('Tải loại công trình csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.loaicongtrinhcsvcService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin loại công trình csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.loaicongtrinhcsvcService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật loại công trình csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateLoaicongtrinhcsvcDto: UpdateLoaicongtrinhcsvcDto) {
    return this.loaicongtrinhcsvcService.update(id, updateLoaicongtrinhcsvcDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa loại công trình csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.loaicongtrinhcsvcService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa loại công trình csvc thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.loaicongtrinhcsvcService.remove(id);
  }
}
