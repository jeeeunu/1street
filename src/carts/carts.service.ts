import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ResultableInterface } from 'src/common/interfaces';

@Injectable()
export class CartsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  //-- 장바구니 물품 추가 --//
  async addCart(
    user_id: number,
    product_id: number,
    quantity: number,
  ): Promise<ResultableInterface> {
    const cartKey = `${user_id}_cart`;

    // 이전 장바구니 정보 가져오기
    const previousCart: any[] = (await this.cacheManager.get(cartKey)) || [];

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
    return (await this.cacheManager.get(cartKey)) || [];
  }

  //-- 장바구니 초기화 --//
  async clearCart(user_id: number): Promise<ResultableInterface> {
    const cartKey = `${user_id}_cart`;

    // 장바구니 정보 초기화
    await this.cacheManager.set(cartKey, []);

    return { status: true, message: '장바구니가 비워졌습니다.' };
  }
}
