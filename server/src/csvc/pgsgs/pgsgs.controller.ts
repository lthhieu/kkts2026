import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CheckPolicies, ResponseMessage } from 'src/configs/my.decorator';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, CsvcSubject } from 'src/configs/enum';
import { PgsgsService } from 'src/csvc/pgsgs/pgsgs.service';
import { CreatePgsgsDto } from 'src/csvc/pgsgs/dto/create-pgsgs.dto';
import { UpdatePgsgsDto } from 'src/csvc/pgsgs/dto/update-pgsgs.dto';

@UseGuards(PoliciesGuard)
@Controller('pgsgs')
export class PgsgsController {
  constructor(private readonly pgsgsService: PgsgsService) { }

  @Post()
  @ResponseMessage('Tạo phòng PGS-GS thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  create(@Body() createPgsgsDto: CreatePgsgsDto) {
    return this.pgsgsService.create(createPgsgsDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo phòng PGS-GS thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CsvcSubject))
  createMany(@Body() createPgsgsDto: CreatePgsgsDto[]) {
    return this.pgsgsService.createMany(createPgsgsDto);
  }

  @Get('/summary')
  @ResponseMessage('Tải tổng quan PGS-GS thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  summary() {
    return this.pgsgsService.summary();
  }

  @Get()
  @ResponseMessage('Tải phòng PGS-GS thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() queryString: string,
  ) {
    return this.pgsgsService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin phòng PGS-GS thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CsvcSubject))
  findOne(@Param('id') id: string) {
    return this.pgsgsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật phòng PGS-GS thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CsvcSubject))
  update(@Param('id') id: string, @Body() updatePgsgsDto: UpdatePgsgsDto) {
    return this.pgsgsService.update(id, updatePgsgsDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa phòng PGS-GS thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  removeMany(@Body() ids: any[]) {
    return this.pgsgsService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa phòng PGS-GS thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CsvcSubject))
  remove(@Param('id') id: string) {
    return this.pgsgsService.remove(id);
  }
}
