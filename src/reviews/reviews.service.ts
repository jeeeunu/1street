import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultableInterface } from 'src/common/interfaces';
import { ReviewsEntity } from 'src/common/entities';
import { CreateReviewsDto } from './dtos';
import { UploadsService } from 'src/uploads/uploads.service';
import { ReviewImageEntity } from 'src/uploads/entities/review-image.entity';
import { UpdateReviewsDto } from './dtos/update-reviews.dto';
import { OrderDetailsEntity } from 'src/orders/entities/order-detail.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsEntity)
    private reviewsEntity: Repository<ReviewsEntity>,
    @InjectRepository(ReviewImageEntity)
    private reviewImageEntity: Repository<ReviewImageEntity>,
    @InjectRepository(OrderDetailsEntity)
    private orderDetailsEntity: Repository<OrderDetailsEntity>,
    private uploadsService: UploadsService,
  ) {}

  //-- 리뷰 작성 --//
  async create(
    userId: number,
    orderDetailId: number,
    createReviewsDto: CreateReviewsDto,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    const orderDetail = await this.orderDetailsEntity.findOne({
      where: { id: orderDetailId },
      relations: ['order', 'order.user'],
    });

    const reviewFind = await this.reviewsEntity.findOne({
      where: { order_detail_id: orderDetailId },
    });

    if (orderDetail.order.user.id !== userId) {
      throw new ForbiddenException('해당 주문에 권한이 없습니다.');
    }

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

  //-- 리뷰 조회 : 상품 아이디 --//
  async findAllByReviews(productId: number): Promise<ReviewsEntity[]> {
    const reviews = this.reviewsEntity.find({
      where: {
        order_detail: {
          product: { id: productId },
        },
      },
      relations: ['order_detail', 'review_image', 'user'],
    });

    return reviews;
  }

  //-- 리뷰 조회 : 유저  --//
  async findAllByUserId(limit: number, cursor: number, userId: number) {
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

  //-- 리뷰 조회 : 스토어 아이디 --//
  async findAllByShopId(shopId: number) {
    const reviews = this.reviewsEntity.find({
      where: {
        order_detail: {
          product: {
            shop: {
              id: shopId,
            },
          },
        },
      },
      relations: [
        'order_detail',
        'order_detail.product',
        'order_detail.product.shop',
      ],
    });
    return reviews;
  }

  //-- 리뷰 조회 : orderDetailId  --//
  async findByRevieworderDetailId(orderDetailId: number) {
    return await this.reviewsEntity.findOne({
      where: { order_detail_id: orderDetailId },
    });
  }

  //-- 리뷰 수정 --//
  async update(orderDetailId: number, updateReviewsDto: UpdateReviewsDto) {
    const existingReview = await this.reviewsEntity.findOne({
      where: {
        order_detail_id: orderDetailId,
      },
    });

    if (!existingReview)
      throw new NotFoundException('수정할 리뷰를 찾을 수 없습니다.');

    const updateReview = Object.assign(existingReview, updateReviewsDto);
    await this.reviewsEntity.save(updateReview);

    return { status: true, message: '리뷰를 수정했습니다.' };
  }

  //-- 리뷰 삭제 --//
  async delete(orderDetailId: number) {
    const review = await this.reviewsEntity.findOne({
      where: { order_detail_id: orderDetailId },
    });
    if (!review) throw new NotFoundException('삭제할 리뷰를 찾을 수 없습니다.');

    await this.reviewsEntity.remove(review);
    return { status: true, message: '리뷰를 삭제했습니다.' };
  }
}
