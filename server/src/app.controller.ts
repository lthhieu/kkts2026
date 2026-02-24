import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Public, ResponseMessage } from 'src/configs/my.decorator';
import type { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private authService: AuthService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Đăng nhập thành công')
  @Post('auth/login')
  async login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @ResponseMessage('Đăng xuất thành công')
  @Post('auth/logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req.user, res);
  }

  @ResponseMessage('Lấy thông tin người dùng thành công')
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('auth/refresh-token')
  @ResponseMessage("Cấp lại token thành công")
  refresh(@Req() req: Request, @Res({ passthrough: true }) response: any) {
    const refreshToken = req.cookies['refresh-token'];
    return this.authService.refresh(refreshToken, response);
  }

}
