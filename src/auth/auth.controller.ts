import {
  Body,
  Req,
  Res,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  //-- 로그인 --//
  @Post('auth/login')
  async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ status: boolean; access_token: string }> {
    const access_token = await this.authService.signIn(signInDto);
    res.cookie('Authentication', access_token);
    return {
      status: true,
      access_token,
    };
  }

  //-- 구글 로그인 --//
  // 구글 로그인 폼
  @Get('/google/login/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return req;
  }

  // 구글 인증정보 반환
  @Get('/google/redirect')
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
