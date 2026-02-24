import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from 'src/auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/configs/jwt.config.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService
    })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
