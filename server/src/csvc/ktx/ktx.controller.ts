import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { KtxService } from './ktx.service';
import { CreateKtxDto } from './dto/create-ktx.dto';
import { UpdateKtxDto } from './dto/update-ktx.dto';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('ktx')
export class KtxController {
  constructor(private readonly ktxService: KtxService) {}

  @Post()
  @ResponseMessage('Tạo KTX thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createKtxDto: CreateKtxDto) {
    return this.ktxService.create(createKtxDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo KTX thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createKtxDto: CreateKtxDto[]) {
    return this.ktxService.createMany(createKtxDto);
  }

  @Get()
  @ResponseMessage('Tải KTX thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.ktxService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin KTX thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.ktxService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật KTX thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updateKtxDto: UpdateKtxDto) {
    return this.ktxService.update(id, updateKtxDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa KTX thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.ktxService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa KTX thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.ktxService.remove(id);
  }
}
