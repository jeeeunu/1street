import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultableInterface } from 'src/common/interfaces';
import { ReviewsEntity } from 'src/common/entities';
import { CreateReviewsDto } from './dtos';
import { UploadsService } from 'src/uploads/uploads.service';
import { ReviewImageEntity } from 'src/uploads/entities/review-image.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsEntity)
    private reviewsEntity: Repository<ReviewsEntity>,
    @InjectRepository(ReviewImageEntity)
    private reviewImageEntity: Repository<ReviewImageEntity>,
    private uploadsService: UploadsService,
  ) {}

  //-- 리뷰 작성 --//
  async create(
    userId: number,
    orderDetailId: number,
    createReviewsDto: CreateReviewsDto,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    const reviewFind = await this.reviewsEntity.findOne({
      where: { order_detail_id: orderDetailId },
    });

    if (reviewFind) {
      throw new ConflictException('이미 리뷰를 작성하셨습니다.');
    }

    const createReview = await this.reviewsEntity.save({
      user: { id: userId },
      order_detail_id: orderDetailId,
      ...createReviewsDto,
    });

    if (files.length > 0) {
      const imageDetails = await this.uploadsService.createProductImages(files);

      for (const imageDetail of imageDetails) {
        const uploadFile = new ReviewImageEntity();
        uploadFile.url = imageDetail;
        uploadFile.review_id = createReview.id;

        await this.reviewImageEntity.save(uploadFile);
      }
      console.log('리뷰 이미지 파일 저장 완료');
    }

    return { status: true, message: '리뷰작성이 완료되었습니다.' };
  }

  //-- 리뷰 조회 : 유저  --//
  async getAllByUserId(limit: number, cursor: number, userId: number) {
    const query = await this.reviewsEntity
      .createQueryBuilder('review')
      .where('review.user_id = :userId', {
        userId: userId,
      })
      .leftJoinAndSelect('review.review_image', 'review_image')
      .leftJoinAndSelect('review.order_detail', 'order_detail')
      .leftJoinAndSelect('order_detail.order', 'order')
      .leftJoinAndSelect('order_detail.product', 'product')
      .leftJoinAndSelect('product.product_image', 'product_image');

    query.take(limit || 10);

    if (cursor) {
      query.andWhere('product.id > :cursor', { cursor });
    }

    return query.getMany();
  }
}
