import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LinhvucdaotaoService } from './linhvucdaotao.service';
import { CreateLinhvucdaotaoDto } from './dto/create-linhvucdaotao.dto';
import { UpdateLinhvucdaotaoDto } from './dto/update-linhvucdaotao.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('linhvucdaotao')
export class LinhvucdaotaoController {
  constructor(private readonly linhvucdaotaoService: LinhvucdaotaoService) { }

  @Post()
  @ResponseMessage('Tạo lĩnh vực đào tạo thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createLinhvucdaotaoDto: CreateLinhvucdaotaoDto) {
    return this.linhvucdaotaoService.create(createLinhvucdaotaoDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo lĩnh vực đào tạo thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createLinhvucdaotaoDto: CreateLinhvucdaotaoDto[]) {
    return this.linhvucdaotaoService.createMany(createLinhvucdaotaoDto);
  }

  @Get()
  @ResponseMessage('Tải lĩnh vực đào tạo thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.linhvucdaotaoService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin lĩnh vực đào tạo thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.linhvucdaotaoService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật lĩnh vực đào tạo thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateLinhvucdaotaoDto: UpdateLinhvucdaotaoDto) {
    return this.linhvucdaotaoService.update(id, updateLinhvucdaotaoDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa lĩnh vực đào tạo thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.linhvucdaotaoService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa lĩnh vực đào tạo thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.linhvucdaotaoService.remove(id);
  }
}
