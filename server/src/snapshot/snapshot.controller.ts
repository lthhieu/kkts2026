import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SnapshotService } from './snapshot.service';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';
import { UpdateSnapshotDto } from './dto/update-snapshot.dto';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/my.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, SnapshotSubject } from 'src/configs/enum';

@UseGuards(PoliciesGuard)
@Controller('snapshot')
export class SnapshotController {
  constructor(private readonly snapshotService: SnapshotService) { }

  @Post()
  @ResponseMessage('Tạo danh sách kiểm kê thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, SnapshotSubject))
  async create(@Body() createSnapshotDto: CreateSnapshotDto, @User() user: IUser) {
    return await this.snapshotService.create(createSnapshotDto, user);
  }

  @Get()
  @ResponseMessage('Tải danh sách kiểm kê thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, SnapshotSubject))
  async getSnapshotsByYear(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string, @User() user: IUser) {
    return await this.snapshotService.getSnapshotsByYear(+current, +pageSize, queryString, user);
  }

  @Get('available-years')
  @ResponseMessage('Tải danh sách các năm đã chốt sổ kiểm kê thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, SnapshotSubject))
  async getAvailableYears() {
    return await this.snapshotService.getAvailableYears();
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa sổ kiểm kê thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, SnapshotSubject))
  removeMany(@Body() createSnapshotDto: CreateSnapshotDto) {
    return this.snapshotService.removeMany(createSnapshotDto.year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snapshotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSnapshotDto: UpdateSnapshotDto) {
    return this.snapshotService.update(+id, updateSnapshotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.snapshotService.remove(+id);
  }
}
