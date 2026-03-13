import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/my.decorator';
import { ChangeStatusDto } from 'src/requests/dto/change-status.dto';
import { CreateCommentDto } from 'src/requests/dto/create-comment.dto';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action, RequestSubject } from 'src/configs/enum';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';

@UseGuards(PoliciesGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) { }

  @Post()
  @ResponseMessage('Tạo đề nghị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, RequestSubject))
  create(@Body() createRequestDto: CreateRequestDto, @User() user: IUser) {
    return this.requestsService.create(createRequestDto, user);
  }

  @Get()
  @ResponseMessage('Lấy danh sách đề nghị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, RequestSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string, @User() user: IUser) {
    return this.requestsService.findAll(+current, +pageSize, queryString, user);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin đề nghị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, RequestSubject))
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch('add-comment/:id')
  @ResponseMessage('Thêm bình luận thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Comment, RequestSubject))
  addComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto, @User() user: IUser) {
    return this.requestsService.addComment(id, createCommentDto, user);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật trạng thái đề nghị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, RequestSubject))
  updateStatus(@Param('id') id: string, @Body() changeStatusDto: ChangeStatusDto) {
    return this.requestsService.updateStatus(id, changeStatusDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa đề nghị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, RequestSubject))
  removeMany(@Body() ids: any[]) {
    return this.requestsService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa đề nghị thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, RequestSubject))
  remove(@Param('id') id: string) {
    return this.requestsService.remove(id);
  }

}
