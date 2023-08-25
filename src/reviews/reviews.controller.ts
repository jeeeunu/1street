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

  //-- 리뷰 조회  --//
  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async getReviews(
    @Query('order_detail_id') orderDetailId?: number,
    @Query('product_id') productId?: number,
  ): Promise<ReviewInterface> {
    if (orderDetailId) {
      return await this.reviewsService.getForOrderDetail(orderDetailId);
    }
    if (productId) {
      return await this.reviewsService.getForProduct(productId);
    }
  }
}
