import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  UsePipes,
  UseGuards,
  ValidationPipe,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ResultableInterface } from 'src/common/interfaces';
import { CreateReviewsDto } from './dtos';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestUserInterface } from '../users/interfaces';
import { ReviewInterface } from './interfaces';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReviewsEntity } from 'src/common/entities';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  //-- 리뷰 작성 --//
  @Post('/:order_detail_id')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('files'))
  async signUp(
    @Param('order_detail_id') orderDetailId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createReviewsDto: CreateReviewsDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.reviewsService.create(
      authUser.user_id,
      orderDetailId,
      createReviewsDto,
      files,
    );
  }

  //-- 리뷰 조회 : 유저 --//
  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async getReviews(
    @AuthUser() authUser: RequestUserInterface,
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
  ): Promise<ReviewsEntity[]> {
    return await this.reviewsService.getAllByUserId(
      limit,
      cursor,
      authUser.user_id,
    );
  }
}
