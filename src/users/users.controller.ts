import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  ValidationPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserCreateDto, EditUserDto } from './dtos';
import { ResultableInterface } from 'src/common/interfaces';
import { RequestUserInterface, userInfo } from './interfaces/index';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //-- 일반 회원가입 --//
  @Post()
  @UsePipes(ValidationPipe)
  async signUp(@Body() userDto: UserCreateDto): Promise<ResultableInterface> {
    return await this.userService.signUp(userDto);
  }

  //-- 유저 조회 --//
  @Get()
  @UseGuards(AuthGuard)
  async getUser(@AuthUser() authUser: RequestUserInterface): Promise<userInfo> {
    return await this.userService.find(authUser.user_id);
  }

  //-- 유저 수정 --//
  @Patch()
  @UseGuards(AuthGuard)
  async editUser(
    @Body() editUserDto: EditUserDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.userService.edit(authUser.user_id, editUserDto);
  }

  //-- 유저 탈퇴 --//
  @Delete()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async deleteUser(
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.userService.delete(authUser.user_id);
  }
}
