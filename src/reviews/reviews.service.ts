import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultableInterface } from 'src/common/interfaces';
import { ReviewsEntity } from 'src/common/entities';
import { CreateReviewsDto } from './dtos';
import { ReviewInterface } from './interfaces';
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
    user_id: number,
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

    if (files.length !== 0) {
      const imageDetails = await this.uploadsService.createS3ImagesDetails(
        files,
      );

      for (const imageDetail of imageDetails) {
        const uploadFile = new ReviewImageEntity();
        uploadFile.review_id = reviewFind.id;
        uploadFile.url = imageDetail.imageUrl;
        uploadFile.original_name = imageDetail.originalName;
        uploadFile.e_tag = imageDetail.eTag;

        await this.reviewImageEntity.save(uploadFile);
      }
    }

    await this.reviewsEntity.save({
      user_id,
      order_detail_id: orderDetailId,
      ...createReviewsDto,
    });
    return { status: true, message: '리뷰작성이 완료되었습니다.' };
  }

  //-- 리뷰 조회 : 주문별  --//
  async getForOrderDetail(orderDetailId: number): Promise<ReviewInterface> {
    const reviews = await this.reviewsEntity.find({
      where: { order_detail_id: orderDetailId },
      // TODO :: 리뷰와 연결된 테이블 설정
      // relations: ['user', 'proudct'],
      select: {
        // user: {
        //   name: true,
        //   provider: true,
        // },
        // proudct: {
        //   product_name: true,
        // },
      },
    });

    return { status: true, results: reviews };
  }

  //-- 리뷰 조회 : 상품별 --//
  async getForProduct(productId: number): Promise<ReviewInterface> {
    const reviews = await this.reviewsEntity.find({
      where: {
        // TO DO :: order_detail 연결 필요
        // order_detail: {
        //   product: {
        //     id: productId,
        //   },
        // },
      },
      relations: ['user', 'order_detail', 'order_detail.product'],
    });
    return { status: true, results: reviews };
  }
}
