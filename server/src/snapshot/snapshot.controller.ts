import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SnapshotService } from './snapshot.service';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';
import { UpdateSnapshotDto } from './dto/update-snapshot.dto';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { User } from 'src/configs/my.decorator';

@UseGuards(PoliciesGuard)
@Controller('snapshot')
export class SnapshotController {
  constructor(private readonly snapshotService: SnapshotService) { }

  @Post()
  create(@Body() createSnapshotDto: CreateSnapshotDto, @User() user: IUser) {
    return this.snapshotService.create(createSnapshotDto, user);
  }

  @Get()
  findAll() {
    return this.snapshotService.findAll();
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
