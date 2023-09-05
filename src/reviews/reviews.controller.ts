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
  Patch,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ResultableInterface } from 'src/common/interfaces';
import { CreateReviewsDto } from './dtos';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestUserInterface } from '../users/interfaces';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReviewsEntity } from 'src/common/entities';
import { UpdateReviewsDto } from './dtos/update-reviews.dto';

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
  async findReviews(
    @AuthUser() authUser: RequestUserInterface,
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
  ): Promise<ReviewsEntity[]> {
    return await this.reviewsService.findAllByUserId(
      limit,
      cursor,
      authUser.user_id,
    );
  }

  //-- 리뷰 수정 --//
  @Patch('/:order_detail_id')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async updateReviews(
    @Param('order_detail_id') orderDetailId: number,
    @Body() updateReviewsDto: UpdateReviewsDto,
  ): Promise<ResultableInterface> {
    return await this.reviewsService.update(orderDetailId, updateReviewsDto);
  }

  //-- 리뷰 삭제 --//
  @Delete('/:order_detail_id')
  @UseGuards(AuthGuard)
  async deleteShop(
    @Param('order_detail_id') orderDetailId: number,
  ): Promise<ResultableInterface> {
    return await this.reviewsService.delete(orderDetailId);
  }
}
