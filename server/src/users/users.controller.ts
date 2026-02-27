import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckPolicies, ResponseMessage, User } from 'src/configs/my.decorator';
import { Action, UserSubject } from 'src/configs/enum';
import { AppAbility } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { PoliciesGuard } from 'src/configs/casl.policies.guard';
import { ChangePasswordDto } from 'src/users/dto/change-password.dto';

@UseGuards(PoliciesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService
  ) { }

  @Post()
  @ResponseMessage('Tạo người dùng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, UserSubject))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/create-many')
  @ResponseMessage('Tạo người dùng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, UserSubject))
  createMany(@Body() createUserDto: CreateUserDto[]) {
    return this.usersService.createMany(createUserDto);
  }

  @Get()
  @ResponseMessage('Lấy danh sách người dùng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserSubject))
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() queryString: string) {
    return this.usersService.findAll(+current, +pageSize, queryString);
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin người dùng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserSubject))
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật người dùng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, UserSubject))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('/delete-many')
  @ResponseMessage('Xóa người dùng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, UserSubject))
  removeMany(@Body() ids: any[]) {
    return this.usersService.removeMany(ids);
  }

  @Delete(':id')
  @ResponseMessage('Xóa người dùng thành công')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, UserSubject))
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }

  @Post('change-password')
  @ResponseMessage('Đổi mật khẩu thành công')
  async handleChangePassword(@User() user: IUser, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user._id, dto);
  }
}
