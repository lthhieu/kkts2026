import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import ms, { StringValue } from 'ms';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user && this.usersService.isValidPassword(pass, user?.password)) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }


    async login(user: IUser, res: Response) {
        const payload = { username: user.email, sub: user._id, role: user.role, unit: user.unit };
        const refresh_token = this.createRefreshToken(payload)
        await this.usersService.updateRefreshToken(refresh_token, user._id)
        res.cookie('refresh-token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get('JWT_REFRESH_EXPIRES_IN')! as StringValue)
        })
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refresh_token,
            user: { _id: user._id, email: user.email, name: user.name, role: user.role, unit: user.unit }
        };
    }

    createRefreshToken = (payload: any) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: ms(this.configService.get('JWT_REFRESH_EXPIRES_IN')! as StringValue) / 1000
        })
        return refreshToken
    }

    async logout(user: any, res: Response) {
        const { _id } = user
        await this.usersService.updateRefreshToken(null, _id)
        res.clearCookie('refresh-token')
        return 'ok'
    }

    async refresh(token: string, response: Response) {
        try {
            this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET')
            })
            const user = await this.usersService.findOneByToken(token)
            if (user) {
                const { _id, email, name, role, unit } = user;
                return this.login({
                    _id: _id.toString(),
                    email, name, role, unit
                }, response)
            } else {
                throw new BadRequestException('Something went wrong')
            }
        } catch (e) {
            throw new BadRequestException('Refresh token hết hiệu lực. Vui lòng đăng nhập!')
        }
    }
}
