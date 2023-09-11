import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ResultableInterface } from 'src/common/interfaces';
import { ProductsEntity } from 'src/common/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImageEntity } from 'src/products/entities/product-image.entity';
import { RequestUserInterface } from 'src/users/interfaces';

@Injectable()
export class CartsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(ProductsEntity)
    private productRepository: Repository<ProductsEntity>,
    @InjectRepository(ProductImageEntity)
    private productImageRepository: Repository<ProductImageEntity>,
  ) {}

  //-- 장바구니 물품 추가 --//
  async addCart(
    user_id: number,
    product_id: number,
    quantity: number,
  ): Promise<ResultableInterface> {
    const cartKey = `${user_id}_cart`;

    // 이전 장바구니 정보 가져오기
    const previousCart: any[] = (await this.cacheManager.get(cartKey)) || [];

    const existingItem = previousCart.find(
      (item) => item.product_id === product_id,
    );

    if (existingItem) {
      throw new NotFoundException('이미 장바구니에 있는 상품입니다.');
    }
    // 새로운 물품 추가
    const newItem = { product_id, quantity };
    const updatedCart = [...previousCart, newItem];

    // 업데이트된 장바구니 정보 저장
    await this.cacheManager.set(cartKey, updatedCart);

    return { status: true, message: '상품이 장바구니에 추가되었습니다.' };
  }

  //-- 장바구니 물품 삭제 --//
  async removeCart(
    user_id: number,
    product_id: number,
  ): Promise<ResultableInterface> {
    const cartKey = `${user_id}_cart`;

    // 이전 장바구니 정보 가져오기
    const previousCart: any[] = (await this.cacheManager.get(cartKey)) || [];

    // 해당 물품을 찾아 삭제
    const updatedCart = previousCart.filter(
      (item) => item.product_id !== product_id,
    );

    // 업데이트된 장바구니 정보 저장
    await this.cacheManager.set(cartKey, updatedCart);

    return { status: true, message: '상품이 장바구니에서 삭제되었습니다.' };
  }

  //-- 장바구니 불러오기 --//
  async getCart(user_id: number): Promise<any[]> {
    const cartKey = `${user_id}_cart`;

    const cart = (await this.cacheManager.get(cartKey)) as any[];
    if (cart === null) {
      return [];
    }
    console.log(cart);
    const content: any[] = [];
    for (const item of cart) {
      const product_id = item.product_id;
      const quantity = item.quantity;
      console.log(product_id);
      const product = await this.productRepository.findOne({
        where: { id: product_id },
      });
      const product_img = await this.productImageRepository.findOne({
        where: { product_id: product_id },
      });
      content.push({
        product_id: product_id,
        product_name: product.product_name,
        product_price: product.product_price,
        product_img: product_img.url,
        quantity: Number(quantity),
        total: quantity * product.product_price,
      });
    }
    return content;
  }

  //-- 장바구니 초기화 --//
  async clearCart(user_id: number): Promise<ResultableInterface> {
    const cartKey = `${user_id}_cart`;

    // 장바구니 정보 초기화
    await this.cacheManager.set(cartKey, []);

    return { status: true, message: '장바구니가 비워졌습니다.' };
  }

  //-- 장바구니 물품 수량 변경 --//
  async updateCartItem(
    user_id: number,
    product_id: string,
    newQuantity: number,
  ): Promise<ResultableInterface> {
    const cartKey = `${user_id}_cart`;

    try {
      // 이전 장바구니 정보 가져오기
      const previousCart: any[] = (await this.cacheManager.get(cartKey)) || [];

      // 해당 물품 찾아서 수량 업데이트
      let itemFound = false;
      const updatedCart = previousCart.map((item) => {
        if (item.product_id === product_id) {
          itemFound = true;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      if (!itemFound) {
        throw new NotFoundException(
          '해당하는 상품을 장바구니에서 찾을 수 없습니다.',
        );
      }

      // 업데이트된 장바구니 정보 저장
      await this.cacheManager.set(cartKey, updatedCart);

      return {
        status: true,
        message: '장바구니 물품 수량이 업데이트되었습니다.',
      };
    } catch (error) {
      // 에러 핸들링 및 메시지 반환
      console.error('ERROR:', error);
      throw new Error('장바구니 물품 수량을 업데이트할 수 없습니다.');
    }
  }

  async findAllCarts(authUser: RequestUserInterface) {
    const carts = await this.cacheManager.get(`${authUser.user_id}_cart`);
    return carts;
  }
}
