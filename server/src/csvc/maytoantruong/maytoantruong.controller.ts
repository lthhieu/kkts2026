import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MaytoantruongService } from './maytoantruong.service';
import { CreateMaytoantruongDto } from './dto/create-maytoantruong.dto';
import { UpdateMaytoantruongDto } from './dto/update-maytoantruong.dto';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';


@UseGuards(PoliciesGuard)
@Controller('maytoantruong')
export class MaytoantruongController {
  constructor(private readonly maytoantruongService: MaytoantruongService) { }

  @Post()
  @ResponseMessage('Tạo tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createMaytoantruongDto: CreateMaytoantruongDto) {
    return this.maytoantruongService.create(createMaytoantruongDto);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.maytoantruongService.summary();
  }

  @Post('/create-many')
  @ResponseMessage('Tạo tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createMaytoantruongDto: CreateMaytoantruongDto[]) {
    return this.maytoantruongService.createMany(createMaytoantruongDto);
  }

  @Get()
  @ResponseMessage('Tải tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.maytoantruongService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Tải tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.maytoantruongService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateMaytoantruongDto: UpdateMaytoantruongDto) {
    return this.maytoantruongService.update(id, updateMaytoantruongDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.maytoantruongService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa tài sản thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.maytoantruongService.remove(id);
  }
}
