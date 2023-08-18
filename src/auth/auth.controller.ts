import { Body, Res, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //-- 로그인 --//
  @Post('/login')
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
}
