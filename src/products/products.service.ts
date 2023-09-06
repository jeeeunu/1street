import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductsEntity, ReviewsEntity, ShopsEntity } from '../common/entities';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';
import { ProductCreateDto, ProductUpdateDto } from './dtos';
import { CategoryEntity } from './entities/category.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { ProductImageEntity } from './entities/product-image.entity';
import { OrderDetailsEntity } from 'src/orders/entities/order-detail.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    @InjectRepository(ProductImageEntity)
    private productImageRepository: Repository<ProductImageEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ShopsEntity)
    private shopRepository: Repository<ShopsEntity>,
    @InjectRepository(OrderDetailsEntity)
    private orderDetailsEntity: Repository<OrderDetailsEntity>,
    @InjectRepository(ReviewsEntity)
    private reviewsEntity: Repository<ReviewsEntity>,
    private uploadsService: UploadsService,
  ) {}

  //-- 상품 등록 --//
  async create(
    data: ProductCreateDto,
    authUser: RequestUserInterface,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    const categoryEntity = await this.categoryRepository.findOne({
      where: {
        id: data.category_id,
      },
    });
    const createProduct = await this.productRepository.save({
      shop_id: authUser.shop_id,
      product_name: data.product_name,
      product_desc: data.product_desc,
      product_price: data.product_price,
      product_domestic: data.product_domestic,
      category: categoryEntity,
    });

    if (files.length > 0) {
      const imageDetails = await this.uploadsService.createProductImages(files);
      console.log('이미지 파일 저장');

      for (const imageDetail of imageDetails) {
        const uploadFile = new ProductImageEntity();
        uploadFile.url = imageDetail;
        uploadFile.product = createProduct;

        await this.productImageRepository.save(uploadFile);
      }
    } else {
      throw new NotFoundException(
        '한개 이상의 썸네일 이미지를 포함해야 합니다.',
      );
    }

    return { status: true, message: '상품을 성공적으로 등록했습니다' };
  }

  //-- 상품 전체보기(무한 스크롤) --//
  async findAll(limit: number, cursor: number): Promise<ProductsEntity[]> {
    const query = await this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.id', 'DESC')
      .leftJoinAndSelect('product.product_image', 'product_image')
      .take(limit || 8);

    if (cursor) {
      await query.where('product.id < :cursor', { cursor });
    }

    return await query.getMany();
  }

  //-- 상품 조회 : 신상품 --//
  async findLatestProducts(): Promise<ProductsEntity[]> {
    const products = await this.productRepository.find({
      relations: ['product_image'],
      order: {
        created_at: 'DESC',
      },
    });
    return products;
  }

  //-- 상품 조회 : 인기 상품 --//
  async findPopularProducts(): Promise<any> {
    const orderDetail = await this.orderDetailsEntity
      .createQueryBuilder('order_detail')
      .select('order_detail.product_id', 'product_id')
      .addSelect('COUNT(order_detail.product_id)', 'count')
      .groupBy('order_detail.product_id')
      .orderBy('count', 'DESC')
      .limit(6)
      .getRawMany();

    const productIds = orderDetail.map((item) => item.product_id);

    const products = await this.productRepository.find({
      where: {
        id: In(productIds),
      },
      relations: ['product_image'],
    });
    return products;
  }

  //-- 상품 조회 : 평점 높은 상품 --//
  async findHighlyRatedProducts(): Promise<any> {
    const productsRank = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.order_detail', 'order_detail')
      .leftJoinAndSelect('order_detail.review', 'review')
      .select([
        'product.id AS product_id',
        'AVG(review.review_rating) AS averageRating',
      ])
      .groupBy('product.id')
      .having('averageRating IS NOT NULL')
      .orderBy('averageRating', 'DESC')
      .limit(6)
      .getRawMany();

    const productIds = productsRank.map((item) => item.product_id);

    const products = [];
    for (const productId of productIds) {
      const product = await this.productRepository.findOne({
        where: {
          id: productId,
        },
        relations: ['product_image'],
      });
      if (product) {
        products.push(product);
      }
    }

    return products;
  }

  //-- 상품 검색 : 키워드 --//
  async findByKeyword(
    limit: number,
    cursor: number,
    keyword: string,
    categoryId: number,
    sort:
      | 'asc'
      | 'desc'
      | 'rank'
      | 'lowPrice'
      | 'highPrice'
      | 'sales'
      | 'latest',
  ): Promise<ProductsEntity[]> {
    let query;

    // 카테고리 검색
    if (categoryId) {
      console.log('카테고리 검색');
      query = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.product_image', 'product_image')
        .where('category.id = :categoryId', { categoryId });
    }

    // 키워드 검색
    if (keyword) {
      console.log('키워드 검색');
      query = await this.productRepository
        .createQueryBuilder('product')
        .where('product.product_name LIKE :keyword', {
          keyword: `%${keyword}%`,
        })
        .leftJoinAndSelect('product.product_image', 'product_image')
        .leftJoinAndSelect('product.order_detail', 'order_detail');
    }

    if (query) {
      query.take(limit || 10);

      // TODO :: 랭킹
      if (sort === 'rank') {
        console.log('랭킹 순으로 정렬');
        query.orderBy('product.product_price', 'ASC');
      }

      if (sort === 'lowPrice') {
        console.log('낮은 가격순으로 정렬');
        query.orderBy('product.product_price', 'ASC');
      }

      if (sort === 'highPrice') {
        console.log('높은 가격순으로 정렬');
        query.orderBy('product.product_price', 'DESC');
      }

      if (sort === 'sales') {
        console.log('판매량순으로 정렬');
        query.orderBy('product.order_detail', 'DESC');
      }

      if (sort === 'desc') {
        console.log('최신순으로 정렬');
        query.orderBy('product.created_at', 'DESC');
      }

      if (cursor) {
        query.andWhere('product.id > :cursor', { cursor });
      }

      return await query.getMany();
    } else {
      throw new NotFoundException('검색어를 입력해주세요');
    }
  }

  //-- 상품 상세보기 --//
  async findById(id: number): Promise<ProductsEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'category',
        'order_detail',
        'order_detail.review',
        'product_image',
        'shop',
        'shop.user',
      ],
    });

    if (!product) throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    return product;
  }

  //-- 상품 조회 : admin-등록된 상품 보기 --//
  async findRegisteredAll(shopId: number): Promise<ProductsEntity[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.product_image', 'product_image')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.shop_id = :shopId', { shopId })
      .orderBy('product.created_at', 'DESC')
      .addOrderBy('product_image.id', 'ASC')
      .getMany();

    return products;
  }

  //-- 상품별 평점 평균값 구하기 --//
  async getRatingAverage(productId: number): Promise<number> {
    const reviews = await this.reviewsEntity
      .createQueryBuilder('review')
      .innerJoin('review.order_detail', 'order_detail')
      .where('order_detail.product_id = :productId', { productId })
      .getMany();

    console.log(reviews);

    if (!reviews || reviews.length === 0) {
      return 0;
    }

    const ratings = reviews.map((review) => review.review_rating);

    const averageRating =
      ratings.reduce(
        (accumulator, currentRating) => accumulator + currentRating,
        0,
      ) / ratings.length;

    console.log(averageRating);
    return averageRating;
  }

  //-- 상품 수정 --//
  async update(
    productId: number,
    data: ProductUpdateDto,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    const existingProduct = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['product_image', 'category'],
    });

    existingProduct.category.id = data.category_id;
    Object.assign(existingProduct, data);
    const updatedProduct = await this.productRepository.save(existingProduct);

    // 이미지 등록
    if (files.length > 0) {
      const imageDetails = await this.uploadsService.createProductImages(files);
      for (const imageDetail of imageDetails) {
        const productImage = await this.productImageRepository.create({
          url: imageDetail,
          product_id: productId,
        });

        await this.productImageRepository.save(productImage);
        console.log('이미지 등록 완료:', imageDetail);
      }
    }

    // 이미지 삭제
    const deleteImgIds = data.delete_imgs.split(',').map(Number);
    for (const deleteImgId of deleteImgIds) {
      const updatedProductImg = await this.productImageRepository.find({
        where: { product_id: updatedProduct.id },
      });

      if (updatedProductImg.length === 0) {
        throw new BadGatewayException(
          '상품에는 한개 이상의 썸네일 이미지가 있어야합니다.',
        );
      }

      const existingImage = await this.productImageRepository.findOne({
        where: { id: deleteImgId },
      });

      if (existingImage) {
        await this.uploadsService.deleteImage(existingImage.url);
        await this.productImageRepository.remove(existingImage);

        console.log('이미지 등록 완료:', existingImage.url);
      }
    }

    console.log('COMPLETE :: 상품 수정 완료');
    return { status: true, message: '상품을 성공적으로 수정했습니다' };
  }

  //-- 상품 삭제 --//
  async delete(id: number): Promise<ResultableInterface> {
    await this.productRepository.delete({ id });
    return { status: true, message: '상품을 성공적으로 삭제했습니다' };
  }
}
