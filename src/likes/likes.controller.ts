import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RequestUserInterface } from '../users/interfaces';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  //-- 좋아요 보기 --//
  @Get()
  @UseGuards(AuthGuard)
  async findLikes(@AuthUser() authUser: RequestUserInterface) {
    return await this.likesService.findAllLikes(authUser);
  }

  //-- 좋아요 등록 --//
  @Post(':productId')
  @UseGuards(AuthGuard)
  async createLike(
    @Param('productId') id: number,
    @AuthUser() authUser: RequestUserInterface,
  ) {
    return await this.likesService.create(id, authUser);
  }

  //-- 좋아요 삭제 --//
  @Delete(':productId')
  @UseGuards(AuthGuard)
  async deleteLike(
    @Param('productId') id: number,
    @AuthUser() authUser: RequestUserInterface,
  ) {
    return await this.likesService.delete(id, authUser);
  }
}
