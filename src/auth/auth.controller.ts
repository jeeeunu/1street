import {
  Body,
  Req,
  Res,
  Controller,
  Get,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { ResultableInterface } from 'src/common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //-- 로그인 --//
  @Post('/login')
  async login(
    @Body() logInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ status: boolean; access_token: string }> {
    const access_token = await this.authService.signIn(logInDto);
    res.cookie('Authentication', access_token);
    return {
      status: true,
      access_token,
    };
  }

  //-- 로그아웃 --//
  @Post('/logout')
  async logout(
    @Req() req,
    @Res() response: Response,
  ): Promise<ResultableInterface> {
    if (req.user) {
      response.clearCookie('access_token');

      return {
        status: true,
        message: '로그아웃이 완료되었습니다.',
      };
    } else {
      throw new HttpException(
        { status: false, message: '이미 로그아웃 되었습니다.' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  //-- google --//
  @Get('/google/login/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return req;
  }

  @Get('/google/redirect') // 고정
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ status: boolean; access_token: string }> {
    const access_token = await this.authService.googleLogin(req);
    res.cookie('Authentication', access_token);
    return {
      status: true,
      access_token,
    };
  }
}
