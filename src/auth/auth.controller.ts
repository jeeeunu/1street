import {
  Body,
  Req,
  Res,
  Controller,
  Get,
  Post,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { ResultableInterface } from 'src/common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //-- 로그인 --//
  @Post('/login')
  @UsePipes(ValidationPipe)
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
  async logout(@Res() res: Response): Promise<Response> {
    res.clearCookie('Authentication');
    return res.json({
      status: true,
      message: '로그아웃 되었습니다.',
    });
  }

  //-- google --//
  @Get('/google/login/callback')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Res() res: Response): Promise<void> {
    return res.redirect('/google/redirect');
  }

  @Get('/google/redirect')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const access_token = await this.authService.googleLogin(req);
    res.cookie('Authentication', access_token);
    res.redirect('/');
  }
}
