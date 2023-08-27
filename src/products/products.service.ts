import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ProductsEntity, ShopsEntity } from '../common/entities';
import { ResultableInterface } from '../common/interfaces';
import { RequestUserInterface } from '../users/interfaces';
import { ProductCreateDto, ProductUpdateDto } from './dtos';
import { CategoryEntity } from './entities/category.entity';
import { PaginationDto } from 'src/common/dtos';
import { UploadsService } from 'src/uploads/uploads.service';
import { ProductImageEntity } from './entities/product_image.entity';

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
  async findAll(paginationDto: PaginationDto): Promise<ProductsEntity[]> {
    const { limit, cursor } = paginationDto;

    const query = this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.id', 'ASC')
      .leftJoinAndSelect('product.product_image', 'product_image')
      .take(limit || 10);

    if (cursor) {
      query.where('product.id > :cursor', { cursor });
    }

    return query.getMany();
  }

  //-- 상품 상세보기 --//
  async findById(id: number): Promise<ProductsEntity> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    return product;
  }

  //-- 상품 검색 (검색어)--//
  async findByKeyword(keyword: string): Promise<ProductsEntity[]> {
    const products = await this.productRepository.find({
      where: { product_name: Like(`%${keyword}`) },
    });
    if (products.length === 0)
      throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    return products;
  }

  //-- 상품 검색 (카테고리)--//
  // async findByCategory(category: number): Promise<ProductsEntity[]> {
  //   const products = await this.productRepository.find({
  //     where: { category: { category_number: category } },
  //     relations: ['category'],
  //   });
  //   if (products.length === 0)
  //     throw new NotFoundException('해당 상품이 존재하지 않습니다.');
  //   return products;
  // }

  //-- 상품 등록 --//
  async create(
    data: ProductCreateDto,
    authUser: RequestUserInterface,
    files: Express.Multer.File[],
  ): Promise<ResultableInterface> {
    const isValidCategory = await this.categoryRepository.findOne({
      where: {
        id: data.category,
      },
    });
    if (!isValidCategory)
      throw new NotFoundException('해당하는 카테고리가 없습니다.');

    const createProduct = await this.productRepository.save({
      product_name: data.product_name,
      product_desc: data.product_desc,
      product_price: data.product_price,
      product_domestic: data.product_domestic,
      category_number: data.category,
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
  // async update(
  //   id: number,
  //   data: ProductUpdateDto,
  //   authUser: RequestUserInterface,
  // ): Promise<ResultableInterface> {
  //   try {
  //     const shop = await this.shopRepository.findOne({
  //       where: { products: { id } },
  //       relations: ['user', 'products'],
  //     });
  //     if (!shop)
  //       throw new NotFoundException('해당 스토어가 존재하지 않습니다.');
  //     if (shop.user.id !== authUser.user_id)
  //       throw new ForbiddenException(
  //         '해당 스토어를 개설한 판매자만 상품을 추가할 수 있습니다.',
  //       );
  //     const {
  //       product_name,
  //       product_desc,
  //       product_price,
  //       product_thumbnail,
  //       category,
  //     } = data;
  //     const categoryId = await this.findCategory(category);
  //     await this.productRepository.update(
  //       { id },
  //       {
  //         category: { id: categoryId },
  //         product_name,
  //         product_desc,
  //         product_price,
  //         // product_thumbnail,
  //       },
  //     );
  //     return { status: true, message: '상품을 성공적으로 수정했습니다' };
  //   } catch (err) {
  //     throw new InternalServerErrorException(
  //       '서버 내부 오류로 처리할 수 없습니다. 나중에 다시 시도해주세요.',
  //     );
  //   }
  // }

  //-- 상품 삭제 --//
  async delete(
    id: number,
    authUser: RequestUserInterface,
  ): Promise<ResultableInterface> {
    const shop = await this.shopRepository.findOne({
      where: { products: { id } },
      relations: ['user', 'products'],
    });
    if (!shop) throw new NotFoundException('해당 스토어가 존재하지 않습니다.');
    if (shop.user.id !== authUser.user_id)
      throw new ForbiddenException(
        '해당 스토어를 개설한 판매자만 상품을 삭제할 수 있습니다.',
      );
    await this.productRepository.delete({ id });
    return { status: true, message: '상품을 성공적으로 삭제했습니다' };
  }

  //-- 카테고리 넘버로 아이디 찾기 --//
  async findCategory(categoryNumber: number) {
    const category = await this.categoryRepository.findOne({
      where: { category_number: categoryNumber },
    });
    if (!category)
      throw new NotFoundException('카테코리 번호가 잘못되었습니다.');
    return category.id;
  }

  //-- 카테고리 만들기 (개발용) --//
  //   async category(data) {
  //     return await this.categoryRepository.save({ ...data });
  //   }
}
