import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MucdichsudungdatService } from './mucdichsudungdat.service';
import { CreateMucdichsudungdatDto } from './dto/create-mucdichsudungdat.dto';
import { UpdateMucdichsudungdatDto } from './dto/update-mucdichsudungdat.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, DanhmucSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('mucdichsudungdat')
export class MucdichsudungdatController {
  constructor(private readonly mucdichsudungdatService: MucdichsudungdatService) { }

  @Post()
  @ResponseMessage('Tạo mục đích sử dụng đất thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  create(@Body() createMucdichsudungdatDto: CreateMucdichsudungdatDto) {
    return this.mucdichsudungdatService.create(createMucdichsudungdatDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo mục đích sử dụng đất thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, DanhmucSubject))
  createMany(@Body() createMucdichsudungdatDto: CreateMucdichsudungdatDto[]) {
    return this.mucdichsudungdatService.createMany(createMucdichsudungdatDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách mục đích sử dụng đất thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.mucdichsudungdatService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin mục đích sử dụng đất thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, DanhmucSubject))
  findOne(@Param('id') id: string) {
    return this.mucdichsudungdatService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật mục đích sử dụng đất thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, DanhmucSubject))
  update(@Param('id') id: string, @Body() updateMucdichsudungdatDto: UpdateMucdichsudungdatDto) {
    return this.mucdichsudungdatService.update(id, updateMucdichsudungdatDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa mục đích sử dụng đất thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  removeMany(@Body() ids: any[]) {
    return this.mucdichsudungdatService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa mục đích sử dụng đất thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, DanhmucSubject))
  remove(@Param('id') id: string) {
    return this.mucdichsudungdatService.remove(id);
  }
}
