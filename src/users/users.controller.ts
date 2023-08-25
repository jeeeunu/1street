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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, EditUserDto } from './dtos';
import { ResultableInterface } from 'src/common/interfaces';
import { RequestUserInterface } from './interfaces/index';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //-- 일반 회원가입 --//
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('files'))
  async signUp(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResultableInterface> {
    return await this.userService.signUp(createUserDto, files);
  }

  //-- 유저 조회 --//
  @Get('/:category')
  @UseGuards(AuthGuard)
  async getUserInfo(@AuthUser() authUser: RequestUserInterface): Promise<any> {
    return await this.userService.find(authUser.user_id);
  }

  //-- 유저 수정 --//
  @Patch()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async editUser(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() editUserDto: EditUserDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.userService.edit(authUser.user_id, editUserDto, files);
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
