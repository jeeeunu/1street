import {
  Controller,
  Param,
  Body,
  Post,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ResultableInterface } from 'src/common/interfaces';
import { CreateReviewsDto } from './dto';
import { AuthUser } from '../auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestUserInterface } from '../users/interfaces';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  //-- 리뷰 작성 --//
  @Post('/:order_detail_id')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async signUp(
    @Param('order_detail_id') orderDetailId: number,
    @Body() createReviewsDto: CreateReviewsDto,
    @AuthUser() authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    return await this.reviewsService.create(
      authUser.user_id,
      orderDetailId,
      createReviewsDto,
    );
  }
}
