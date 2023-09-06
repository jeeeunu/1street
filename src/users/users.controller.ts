import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseGuards,
  ValidationPipe,
  Delete,
  Patch,
  UploadedFiles,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { ResultableInterface } from 'src/common/interfaces';
import { RequestUserInterface } from './interfaces/index';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth.decorator';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //-- 일반 회원가입 --//
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('files'))
  async signUp(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResultableInterface> {
    return await this.usersService.signUp(createUserDto, files);
  }

  //-- 유저 수정 --//
  @Patch()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async editUser(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateUserDto: UpdateUserDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.usersService.update(
      authUser.user_id,
      updateUserDto,
      files,
    );
  }

  //-- 유저 탈퇴 --//
  @Delete()
  @UseGuards(AuthGuard)
  async deleteUser(
    @AuthUser() authUser: RequestUserInterface,
    @Res() res: Response,
  ): Promise<any> {
    res.clearCookie('Authentication');
    const message = await this.usersService.delete(authUser.user_id);
    return res.json({
      status: true,
      message: message,
    });
  }
}
