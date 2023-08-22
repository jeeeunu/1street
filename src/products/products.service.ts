import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ShopsEntity } from '../shops/entities/shops.entity';

import { RequestUserInterface } from '../users/interfaces';
import { ProductCreateDto, ProductUpdateDto } from './dto';
import { CategoryEntity } from './entities/category.entity';
import { ProductsEntity } from './entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ShopsEntity)
    private shopRepository: Repository<ShopsEntity>,
  ) {}

  //-- 상품 상세보기 --//
  async findById(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    return product;
  }

  //-- 상품 검색 (검색어)--//
  async findByKeyword(keyword: string) {
    const products = await this.productRepository.find({
      where: { product_name: Like(`%${keyword}`) },
    });
    if (products.length === 0)
      throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    return products;
  }

  //-- 상품 검색 (카테고리)--//
  async findByCategory(category: number) {
    const products = await this.productRepository.find({
      where: { category: { category_number: category } },
      relations: ['category'],
    });
    if (products.length === 0)
      throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    return products;
  }

  //-- 상품 등록 --//
  async create(data: ProductCreateDto, authUser: RequestUserInterface) {
    const shop = await this.shopRepository.findOne({
      where: { id: data.shop_id },
      relations: ['user'],
    });
    if (!shop) throw new NotFoundException('해당 스토어가 존재하지 않습니다.');
    if (shop.user.id !== authUser.user_id)
      throw new ForbiddenException(
        '해당 스토어를 개설한 판매자만 상품을 추가할 수 있습니다.',
      );
    const {
      product_name,
      product_desc,
      product_price,
      product_thumbnail,
      shop_id,
      category,
    } = data;
    const categoryId = await this.findCategory(category);
    await this.productRepository.insert({
      shop: { id: shop_id },
      category: { id: categoryId },
      product_name,
      product_desc,
      product_price,
      product_thumbnail,
    });
    return { status: true, message: '상품을 성공적으로 등록했습니다' };
  }

  //-- 상품 수정 --//
  async update(
    id: number,
    data: ProductUpdateDto,
    authUser: RequestUserInterface,
  ) {
    const shop = await this.shopRepository.findOne({
      where: { products: { id } },
      relations: ['user', 'products'],
    });
    if (!shop) throw new NotFoundException('해당 스토어가 존재하지 않습니다.');
    if (shop.user.id !== authUser.user_id)
      throw new ForbiddenException(
        '해당 스토어를 개설한 판매자만 상품을 추가할 수 있습니다.',
      );
    const {
      product_name,
      product_desc,
      product_price,
      product_thumbnail,
      category,
    } = data;
    const categoryId = await this.findCategory(category);
    await this.productRepository.update(
      { id },
      {
        category: { id: categoryId },
        product_name,
        product_desc,
        product_price,
        product_thumbnail,
      },
    );
    return { status: true, message: '상품을 성공적으로 수정했습니다' };
  }
  //-- 상품 삭제 --//
  async delete(id: number, authUser: RequestUserInterface) {
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

  //-- 카테고리 만들기 (개발용) --//
  //   async category(data) {
  //     return await this.categoryRepository.save({ ...data });
  //   }

  //-- 카테고리 넘버로 아이디 찾기 --//
  async findCategory(categoryNumber: number) {
    const category = await this.categoryRepository.findOne({
      where: { category_number: categoryNumber },
    });
    if (!category)
      throw new NotFoundException('카테코리 번호가 잘못되었습니다.');
    return category.id;
  }
}
