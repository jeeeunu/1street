import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity, ShopsEntity } from '../common/entities';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';
import { ProductCreateDto, ProductUpdateDto } from './dtos';
import { CategoryEntity } from './entities/category.entity';
import { UploadsService } from 'src/uploads/uploads.service';
import { ProductImageEntity } from './entities/product-image.entity';

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
    private uploadsService: UploadsService,
  ) {}

  //-- 상품 전체보기 --//
  async findAllBasic(): Promise<ProductsEntity[]> {
    const products = await this.productRepository.find({
      relations: ['product_image'],
    });
    return products;
  }

  //-- 상품 전체보기(무한 스크롤) --//
  async findAll(limit: number, cursor: number): Promise<ProductsEntity[]> {
    const query = await this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.id', 'DESC')
      .leftJoinAndSelect('product.product_image', 'product_image')
      .take(limit || 10);

    if (cursor) {
      await query.where('product.id < :cursor', { cursor });
    }

    return await query.getMany();
  }

  //-- 상품 검색 (검색어)--//
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
    if (categoryId) {
      console.log('카테고리 검색');
      query = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.product_image', 'product_image')
        .where('category.id = :categoryId', { categoryId });
    }

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
        query.orderBy('product.created_at', 'ASC');
      }

      if (cursor) {
        query.andWhere('product.id > :cursor', { cursor });
      }

      return await query.getMany();
    } else {
      throw new NotFoundException('검색어를 입력해주세요');
    }
  }

  //-- 상품 검색 (카테고리)--//
  // async findByCategory(
  //   limit: number,
  //   cursor: number,
  //   categoryId: number,
  // ): Promise<ProductsEntity[]> {
  //   const query = await this.productRepository
  //     .createQueryBuilder('product')
  //     .leftJoinAndSelect('product.category', 'category')
  //     .leftJoinAndSelect('product.product_image', 'product_image')
  //     .where('category.id = :categoryId', { categoryId });

  //   if (cursor) {
  //     query.andWhere('product.id > :cursor', { cursor });
  //   }

  //   query.take(limit || 10);

  //   return await query.getMany();
  // }

  //-- 상품 상세보기 --//
  async findById(id: number): Promise<ProductsEntity> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.product_image', 'product_image')
      .leftJoinAndSelect('product.shop', 'shop')
      .leftJoinAndSelect('shop.user', 'user')
      .where('product.id = :id', { id })
      .getOne();
    if (!product) throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    return product;
  }

  //-- admin : 등록된 상품 보기 --//
  async findRegisteredAll(shopId: number): Promise<ProductsEntity[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.product_image', 'product_image')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.shop_id = :shopId', { shopId })
      .orderBy('product.created_at', 'DESC')
      .addOrderBy('product_image.id', 'ASC')
      .getMany();

    console.log(products);

    return products;
  }

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

  //-- 상품 수정 --//
  async update(
    productId: number,
    data: ProductUpdateDto,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    const existingProduct = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.product_image', 'product_image')
      .where('product.id = :productId', { productId })
      .getOne();
    Object.assign(existingProduct, data);
    const updatedProduct = await this.productRepository.save(existingProduct);

    // 이미지 등록
    if (files.length > 0) {
      const imageDetails = await this.uploadsService.createProductImages(files);
      for (const imageDetail of imageDetails) {
        console.log(imageDetail, 'heheheheheheheheheheh');
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

  //-- 카테고리 넘버로 아이디 찾기 --//
  // async findCategory(categoryNumber: number) {
  //   const category = await this.categoryRepository.findOne({
  //     where: { category_number: categoryNumber },
  //   });
  //   if (!category)
  //     throw new NotFoundException('카테코리 번호가 잘못되었습니다.');
  //   return category.id;
  // }

  //-- 카테고리 만들기 (개발용) --//
  //   async category(data) {
  //     return await this.categoryRepository.save({ ...data });
  //   }
}
