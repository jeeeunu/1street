import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultableInterface } from 'src/common/interfaces';
import { CreateReviewsDto } from './dto';
import { ReviewsEntity } from 'src/common/entities';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsEntity)
    private reviewsEntity: Repository<ReviewsEntity>,
  ) {}

  //-- 리뷰 작성 --//
  async create(
    user_id: number,
    orderDetailId: number,
    createReviewsDto: CreateReviewsDto,
  ): Promise<ResultableInterface> {
    const reviewFind = await this.reviewsEntity.findOne({
      where: { order_detail_id: orderDetailId },
    });

    console.log(reviewFind);
    if (reviewFind) {
      throw new ConflictException('이미 리뷰를 작성하셨습니다.');
    }

    await this.reviewsEntity.save({
      user_id,
      order_detail_id: orderDetailId,
      createReviewsDto,
    });
    return { status: true, message: '리뷰작성이 완료되었습니다.' };
  }
}
