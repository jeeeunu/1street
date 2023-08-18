import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserCreateDto } from './dto/index';
import { RequestUserInterface } from './interfaces/index';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //-- 회원가입 --//
  @Post()
  @UsePipes(ValidationPipe)
  async signUp(
    @Body() userDto: UserCreateDto,
  ): Promise<{ status: boolean; message: string }> {
    return await this.userService.signUp(userDto);
  }

  //-- AuthGuard/AuthUser 테스트용 --//
  @Get()
  @UseGuards(AuthGuard)
  async test(
    @AuthUser() authUser: RequestUserInterface, // user 정보 받아올 수 있음
  ): Promise<any> {
    return console.log(authUser);
  }
}
